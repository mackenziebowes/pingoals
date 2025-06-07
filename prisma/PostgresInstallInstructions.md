# How to set up a Remote Postgres DB on Akamai Linux

1. Provision VPS IP & Credentials
   Provision a VPS running Ubuntu (22.04 or later). You’ll need:

```bash
IP:     123.45.67.89
User:   root
Pass:   (or SSH key)
```

Optional: set up a new user with sudo access:

```bash
adduser mackenzie
usermod -aG sudo mackenzie
```

2. SSH into the server

```bash
ssh root@123.45.67.89
```

3. Initialize the server

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```

4. Set up Postgres
   Start by opening the psql writer program:

```bash
sudo -u postgres psql
```

Then start entering commands - psql commands always end with a `;`

Part A:

```sql
CREATE USER myapp_user WITH PASSWORD 'supersecurepassword';
```

note how "myapp_user" is 'naked' - not a string!

Enter these one at a time:

Part B:

```sql
CREATE DATABASE myapp_db;
```

Part C:

```sql
GRANT ALL PRIVILEGES ON DATABASE myapp_db TO myapp_user;
```

Quit:

```sql
\q
```

But wait! There are `schemas` on databases - you need to grant your admin the ability to modify schemas.
By default, there is just `public` - let's add it.
Part D:

```bash
# Straight up, I see that we repeat postgres here. I'm writing this note while working on something else, so we may need to
# Experiement and see if this command can be simpler.
   sudo -u postgres psql -U postgres -d myapp_db
#       ^A ^B       ^C   ^D ^E       ^F ^G
# A: use the Superuser for this next command
# B: Do a postgres thing
# C: Specifically, open a postgresql terminal
# D: oh, btw, as the super user...
# E: do a postgres thing...
# F: Specifically, select the database known as...
# G: myapp_db.
# This command scopes your next PSQL lines specifically to the app you just created.
```

Part E:

```sql
GRANT ALL ON SCHEMA public TO myapp_user;
```

Quit:

```sql
\q
```

Done!

6. Restrict UFW settings

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow from 127.0.0.1 to any port 5432 proto tcp # localhost connections are fine allowed - colocate your server with your db, or, put your server on a static IP elsewhere
sudo ufw enable
sudo ufw status numbered # this shows a table of the existing rules
```

After you run `ufw status numbered`, you'll see a table kinda like this:

```bash
# A decently secured ufw status numbered table looks like this
     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    Anywhere        # allow SSH tunneling over ipv4
[ 2] 80                         ALLOW IN    Anywhere        # allow HTTP traffic over ipv4
[ 3] 443                        ALLOW IN    Anywhere        # allow HTTPS traffic over ipv4
[ 4] 5432/tcp                   ALLOW IN    127.0.0.1       # allow Postgres traffic from... local! If you use a static IP for your server, this rule should show that static IP
                                                            # If you set a static IP, then this port only works on traffic FROM that IP. YMMV understanding this config, sorry! Ask ChatGPT ;)
[ 5] 22/tcp (v6)                ALLOW IN    Anywhere (v6)   # allow SSH tunneling over ipv6
[ 6] 80 (v6)                    ALLOW IN    Anywhere (v6)   # allow HTTP traffic over ipv6
[ 7] 443 (v6)                   ALLOW IN    Anywhere (v6)   # allow HTTPS traffic over ipv6
```

If you have extra stuff in there, you can delete rules by the number on the left hand side, like

```bash
# CONDITIONAL:
sudo ufw delete n # where n is the offending rule.
# protip: rerun `sudo ufw status numbered` after deleting - if you delete a rule, following rules shift up so double check the index~!
```

7. Open tunnel to server
   Here's the command to open a temporary tunnel:

```bash
ssh -L 5432:localhost:5432 mackenzie@123.45.67.89
#      ^A             ^B   ^C        ^D
#   A: Port on your local device
#   B: Port on your remote VPS (This is set in ufw.4 in step 6)
#   C: Your VPS admin username
#   D: Your VPS public IP
```

8. Add postgres link to prisma (note: only works while the tunnel is open)
   Here's the ENV variable to insert to your Prisma folder:

```bash
DATABASE_URL="postgresql://myapp_user:supersecurepassword@localhost:5432/myapp_db"
#                          ^A         ^B                  ^C             ^D
#   A: The username from step 4-A
#   B: The password from step 4-A
#   C: Part A from step 7 (Your local port that's tunneled to the remote port)
#   D: The name of the db from step 4-B
```

9. Send it
   You're done!
   As long as your tunnel is open on your machine, prisma should connect and work with your remote Postgres install.
   Bonus:
   If you colocate your server on your VPS, no tunnel is required. You're already local!
