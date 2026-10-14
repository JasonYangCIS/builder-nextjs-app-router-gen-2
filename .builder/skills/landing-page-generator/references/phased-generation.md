# Phased generation

When on (default), do not build the whole page at once:

1. Generate three direction options for the hero and first section only, saved as `<slug>-a`, `<slug>-b`, `<slug>-c` (data files and images):
   - **A (baseline):** follows the user's tone choices exactly.
   - **B (alternate):** same tone category, different image composition and headline angle.
   - **C (AI's pick):** ignore the stated impression; choose what you think converts best for the audience, needs and KPI, and give a one-line reason.
   - All three obey the avoid-list, the layout rule and the copy limits.
2. Share the three URLs, navigate the preview to `/landing/<slug>-a`, and ask which to continue with. Do not proceed until the user answers.
3. Build the full page with the chosen direction at `<slug>`, then delete the other two data files and their images. Confirm with the user before deleting.
