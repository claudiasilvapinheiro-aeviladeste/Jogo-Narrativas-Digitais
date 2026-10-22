<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Game rules live as pure functions in `src/lib/quest.ts` (status, score, unlocks are derived from `completed`); UI only renders them — keeps score, map, mascot and mist in sync and testable.
- Free-play quest state is kept in browser localStorage (`src/hooks/use-quest.ts`) until the teacher saves to Cloud — no account needed to play.
- Rule tests live in `src/test/quest.test.ts`; update them when game rules change.
