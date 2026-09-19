# Instructions

the file `src/db/schema.ts` is the database schema.\
the database is used to store user data and what not day by day

# IMPORTANT!!!

after any changes to the schema, you MUST run `bun db:generate` and adjust migration if required to avoid data loss and make sure the changes apply in new binaries!!!

# What we're making

we're making a TUI Tamagotchi. it's a terminal user interface like opencode or codex.\
every time you open vscode it keeps it happy and gives you coins to buy food to feed it\
every time you make a git commit you get a few extra coins to feed it\
that sorta thing
