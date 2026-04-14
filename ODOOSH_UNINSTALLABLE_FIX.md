# Odoo.sh Fix: `pos_lebanon_custom` shows **Uninstallable**

## CRITICAL: duplicate module folders (fixed in this repo)

If the **same technical name** exists twice on the addons path (example: `user/pos_lebanon_custom/` **and** `user/custom_addons/pos_lebanon_custom/`), Odoo can load the **wrong** copy or mark the module as **uninstallable**.

This repository previously had a **stale** `pos_lebanon_custom/` at the **repository root** *and* `custom_addons/pos_lebanon_custom/`. The root copy was older (e.g. `18.0` manifest + old XML).

**Fix applied:** the duplicate root folder `pos_lebanon_custom/` was **removed**. Keep **only** `custom_addons/pos_lebanon_custom/`, then push to Odoo.sh and rebuild.

---

## What your screenshots prove
- `pos_lebanon_custom` is not failing first.
- Its dependency `point_of_sale` is shown as **Uninstallable**.
- If `point_of_sale` is uninstallable, your module can never show **Install**.

## Fast recovery path (do exactly in order)

1. In Odoo.sh, open the same branch build where you tested.
2. Open **Logs** and search for `point_of_sale` errors during module loading.
3. In the database UI:
   - Activate developer mode.
   - Go to **Apps**.
   - Remove the "Apps" filter if present.
   - Search `point_of_sale`.
4. Try installing `point_of_sale` **alone** first.
   - If this fails, fix that first (dependency/env/version issue).
5. After `point_of_sale` installs, go back and install `pos_lebanon_custom`.

---

## Terminal checks inside Odoo.sh build

Use a terminal in Odoo.sh editor:

```bash
cd ~/src/user
odoo-bin shell -d <YOUR_DB_NAME>
```

Then run:

```python
mods = env['ir.module.module']
for name in ['point_of_sale', 'pos_lebanon_custom']:
    m = mods.search([('name', '=', name)], limit=1)
    print(name, "exists=", bool(m), "state=", m.state if m else None, "latest=", m.latest_version if m else None)
```

If `point_of_sale` state is `uninstallable`, that is the blocker.

---

## Most common root causes on Odoo.sh

1. **Branch/version mismatch**
   - Your addon manifest is for `19.0` (see `pos_lebanon_custom/__manifest__.py`).
   - Ensure Odoo.sh project/branch is also **Odoo 19.0**.

2. **Broken official module load**
   - A failing custom module can break registry loading and make dependencies look uninstallable.
   - Check build logs for Python traceback before the Apps screen.

3. **Wrong repo/build opened**
   - You may be testing another branch build than the one you pushed.

---

## What I changed now

- Set `application` to `False` in `custom_addons/pos_lebanon_custom/__manifest__.py` (cleaner for technical addon behavior).
- This does **not** bypass dependency rules; `point_of_sale` must still be installable.

---

## Next action for new chat

If still blocked, paste:
- Build log traceback lines containing `point_of_sale` or `ERROR`.
- Output of the shell snippet above.

With those two, the exact blocker can be fixed quickly.

---

## If `point_of_sale` is **installed** but `pos_lebanon_custom` is still **Uninstallable**

The Apps UI can show a **stale** dependency row until the module list is refreshed correctly.

### 1) Confirm real states in Odoo shell (source of truth)

```python
mods = env["ir.module.module"]
for name in ["point_of_sale", "pos_lebanon_custom"]:
    m = mods.search([("name", "=", name)], limit=1)
    print("==", name, "==")
    print(" state:", m.state)
    print(" installable:", m.installable)
    if m:
        for d in m.dependencies_id:
            dep = d.depend_id
            print("  depends on:", dep.name, "->", dep.state, "(installable:", dep.installable, ")")
```

- If **any** dependency is not `installed` / `to upgrade` / `to remove` handling, fix that dependency first.
- If `pos_lebanon_custom.installable` is `False`, Odoo thinks the addon folder/manifest is invalid on disk (wrong build, wrong branch, or import/manifest error).

### 2) Force-refresh the module list (same DB)

```python
mods.update_list()
env.cr.commit()
```

Then in the UI: **Apps → Update Apps List** again.

### 3) Bump addon version + push (forces Odoo.sh to rebuild metadata)

The addon version in manifest is **19.0.1.0.1** (after duplicate removal). Push, wait for **green build**, open that build URL, repeat step (1).

### 4) If still stuck: reset the module row (dev DB only)

This only helps when the row is “poisoned” / wrong state:

```python
m = env["ir.module.module"].search([("name", "=", "pos_lebanon_custom")], limit=1)
m.write({"state": "uninstalled"})
env.cr.commit()
mods.update_list()
env.cr.commit()
```

Then install from **Apps**.

### 5) Repo layout reminder (Odoo.sh)

Your addon must be visible under `/src/user/...` on the addons path. If it is nested (example: `user/custom_addons/pos_lebanon_custom`), `custom_addons` must be on `addons_path` or you must move the module folder up.

---

## Code fixes shipped in repo (may help installability)

- **19.0.1.0.1**: removed duplicate root `pos_lebanon_custom/`; manifest aligned with Odoo 19; safer `_load_pos_data_fields()` merge.
- **pos_config view**: inherit uses `//div[@id='title']` + plain `<group>` (avoids fragile `<setting>` xpath).

