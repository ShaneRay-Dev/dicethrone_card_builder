# Layer Stack Reference

Last updated: February 12, 2026

Current render order from bottom to top:

1. Bleed (Large)
2. Bleed (Small)
3. Background Lower (Ability Upgrade)
4. Background Upper (Ability Upgrade)
5. Background Lower (Action Cards)
6. Background Upper (Action Cards)
7. Artwork
8. Image Frame
9. Top Name Gradient
10. Bottom Name Gradient
11. Frame Shading
12. Frame (Border)
13. Card ID
14. Card ID Text
15. Panel Bleed
16. Panel Lower
17. Second Ability Frame
18. Panel Upper
19. Cost Badge
20. Attack Modifier (Roll Phase only)
21. Title
22. Card Text

Notes:
- Title and Card Text are separate layers above panels for visibility.
- Cost Badge sits above Panel Upper per current configuration.
- Ability Upgrade backgrounds replace the Action Cards background assets when that subtype is selected.
- Artwork now renders above the background upper layer.
- Hero Upgrade > Ability Upgrade disables Image Frame and Attack Modifier layers by default.
