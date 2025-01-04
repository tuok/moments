# moments
Simple diary-like life event logger with support for tags.

Entries are saved as json text files in hierarchical directory structure. This way entries are easily readable even if there's no proper environment to run the actual software (for example years afterwards).

## Run

- Copy entries to an accessible place, update `.env` if place differs from `./data`
- Create & activate virtual environment for the backend with `source ./create_venv.sh`, if needed
- Build and "deploy" frontend: `cd moments-frontend && ./dev-deploy.sh`
- Start backend with: `cd moments-backend-python && python moments.py`

## GitHub auth

- Generate PAT in https://github.com/settings/tokens
- When pushing/pulling, type in the username and the generated PAT
- Run `git config credential.helper store` under repo to persist the token
