import { existsSync, rmSync } from "node:fs"

if (!existsSync(".next")) process.exit(0)

try {
  rmSync(".next", { recursive: true, force: true })
} catch (e) {
  const code = /** @type {NodeJS.ErrnoException} */ (e).code
  if (code === "EPERM" || code === "EBUSY") {
    console.error(
      "\nCould not delete .next (files are locked). On Windows this is usually because `npm run dev` is still running.\n" +
        "Stop the dev server (Ctrl+C in every terminal), close other tools using this repo, then run clean/build again.\n" +
        "Repos under OneDrive/Desktop can also trigger EPERM—moving the project outside synced folders often helps.\n",
    )
    process.exit(1)
  }
  throw e
}
