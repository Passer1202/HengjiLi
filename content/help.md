# Help

This site is a terminal. Profile pages are commands — `bio`, `papers`, `honors`, `education`, and `contact` — and tools live in `/bin`. Opening a page clears the screen; `cat` prints its text without clearing.

## commands

- `ls [dir]` list a directory (try `ls /bin`)
- `cat <path>` print a document (pipe-friendly)
- `head [path]` show the first lines
- `tail [path]` show the last lines
- `grep <pat>` filter matching lines
- `find [path]` walk the virtual file system
- `tree [path]` draw the file system as a tree
- `more [path]` page a document or piped input
- `less [path]` page with PageUp/PageDown
- `cd <dir>` change directory (`cd /bin`, `cd ..`, `cd /`)
- `pwd` show the current directory
- `clear` clear the screen
- `wc` count lines, words, and bytes
- `exit` return to the introduction

## tips

- Open a page with `papers`; return with `home` or `exit`.
- Pipes work: `cat papers | grep Hengji`.
- History: ↑/↓ or Ctrl-P/N. Cancel: Ctrl-C. Clear: Ctrl-L.
