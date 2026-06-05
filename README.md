[README.md](https://github.com/user-attachments/files/28620115/README.md)
# Hypothesis Testing Tool
### Global Economics · Grade 11 · Term 3 Learning Evidence 4 · 2025–2026

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main webpage (structure + content) |
| `style.css`  | All visual styles and layout |
| `main.js`    | Statistics engine, canvas drawing, CSV logic, PDF export |
| `README.md`  | This file |

---

## How to Open the Webpage Locally

1. Place all four files (`index.html`, `style.css`, `main.js`, `README.md`) in the **same folder**.
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
   - No server needed — it runs entirely in the browser.

---

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g., `hypothesis-tool`).
2. Upload `index.html`, `style.css`, and `main.js` to the repository root.
3. Go to **Settings → Pages → Source** → select branch `main`, folder `/ (root)`.
4. GitHub will generate a public URL such as:
   `https://yourusername.github.io/hypothesis-tool/`
5. Paste that URL into:
   - The **C10 report** (Hyperlink to Deployed Webpage section)
   - The **AI Record** tab of the webpage (if desired)

---

## Testing C9 Mode with the Three Provided CSV Files

1. Click the **C9 — CSV Mode** tab.
2. Click the upload zone (or drag & drop) and select one of the three provided files:
   - `test_database_1.csv`
   - `test_database_2.csv`
   - `test_database_3.csv`
3. After upload, set the column dropdowns:
   - **Group Column** — the column containing group labels
   - **Value Column** — the numeric (or binary 0/1) outcome column
   - **Benchmark Group** — the reference group (H₀)
   - **Test Group** — the comparison group (H₁)
4. Choose **Test Direction** and **Significance Level α**.
5. Click **▶ Run Hypothesis Test**.
6. The page will display:
   - Summary statistics table for both groups
   - Normal curve with shaded p-value region and critical-value lines
   - Test statistic z, p-value, critical value, decision, and contextual conclusion

### Expected CSV structure

```
group,income
A,42300
A,38750
B,55100
B,61200
...
```

Two columns minimum: one group-label column and one numeric value column (or binary 0/1).

---

## AI Development Record

This webpage was built with AI assistance. The conversation link is visible in the
**AI Record** tab of the deployed webpage:

**https://claude.ai/share/7435ca19-f1c1-4438-aaba-09be647b9987**

---

## C10 Report Checklist (before submitting)

- [ ] Replace `[Insert your GitHub Pages URL here]` with your actual deployed URL
- [ ] Replace screenshot placeholder notes with real captures from the C9 mode
- [ ] Fill in the exact z-statistic and p-value in the Results table from your CSV run
- [ ] Confirm the three CSV files all load and produce correct output
- [ ] Download the PDF using the gold button in the C10 — Report tab

---

## Real-World Sources Used in the C10 Report

| # | Citation |
|---|---------|
| 1 | U.S. Census Bureau. (2024). *Income in the United States: 2023* (Report P60-282). https://www.census.gov/library/publications/2024/demo/p60-282.html |
| 2 | International Labour Organization. (2024). *Global Wage Report 2024–25*. https://www.ilo.org/sites/default/files/2024-11/GWR-2024_Layout_E_RGB_Web.pdf |
| 3 | Institute for Policy Studies. (2024). *Income inequality*. Inequality.org. https://inequality.org/facts/income-inequality/ |
