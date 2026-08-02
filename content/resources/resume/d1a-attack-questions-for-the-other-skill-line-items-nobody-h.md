---
title: "D1a. Attack questions for the other skill-line items nobody has grilled you on yet"
category: resume
part: "SECTION D — SKILLS, EDUCATION & ACHIEVEMENTS"
order: 104.02
priority: P2
status: not-started
source: 01_RESUME_DEEP_DIVE.md
---

These sit on the skills line with no bullet to anchor them — expect the interviewer to pick one and ask you to defend it directly.

- **MySQL** — "You list both MySQL and Postgres — which service actually ran on MySQL, and why that engine over Postgres there?" Be ready to name real MySQL-specific things: InnoDB vs MyISAM, `AUTO_INCREMENT` vs Postgres sequences, replication (binlog-based) vs Postgres WAL streaming, and one real difference that bit you (case-insensitive collation, `ON DUPLICATE KEY UPDATE` vs `ON CONFLICT`).
- **MongoDB** — "Which service used Mongo, and what made you choose embedding vs referencing there?" Follow-ups to expect: "show me a document you designed," "what would make you shard that collection," "why not just use Postgres JSONB instead?" If the honest answer is "exposure only," say so and pivot to what you *would* evaluate before choosing it.
- **DynamoDB** — "Walk me through a table you designed — partition key, sort key, and why." Follow-ups: "did you ever hit a hot partition, what did you do," "GSI vs LSI decision you made," "how did you model a one-to-many relationship without joins?" This is the single most-asked NoSQL interview question at senior level — do not leave it unanswered.
- **Django/Flask** — "Which of your projects actually ran on Django or Flask?" Follow-ups: "walk me through a view/serializer you wrote," "Django ORM N+1 — how would you catch it," "Flask vs Django — when would you pick the lighter one?" If it's exposure-only, be upfront and pivot to your Rails equivalent (you can speak to MVC/ORM patterns generally).
- **Chef** — this is your strongest hidden story (the SSL-renewal LWRP bug, already in `02_LEADERSHIP_STORY_BANK.md`), but be ready for the *technical* version, not just the narrative: "what's a Chef recipe/cookbook/resource," "what does idempotent mean in a Chef resource and why does it matter," "Chef vs Ansible — agent-based vs agentless, pull vs push." Don't let the story carry the technical questions — know the primitives too.
- **.NET MVC** — listed as a separate framework from the SEB C# wrapper project. Have a one-line answer ready for "which project used .NET MVC specifically, as opposed to just C#?" — if the SEB wrapper was a console/service app rather than an MVC app, say so plainly rather than let the interviewer assume a web app that doesn't exist.
