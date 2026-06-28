# LUMINHIVE — Core Game Design (Redesigned Spec)

> *A cozy-to-competitive light-bee simulator. Starts soft and relaxing; gradually becomes a deep optimisation game. Simulator first, competitive second, beautiful always.*

---

## 1. Overview
- **Title:** Luminhive
- **Genre:** Cozy-to-Competitive Simulator (progression / optimisation)
- **Core fantasy:** You are a keeper of **light-bees** in a floating world. Cultivate glowing pollen, command swarms of **Lumens**, grow a radiant **hive**, and optimise every system to become the most efficient pollinator in the sky.
- **Headline metric:** **HPS — Honey Per Second.**

## 2. World — The Luminarium
- Floating islands called **Skygardens** with stone pathways and wooden fences.
- Light is a real resource: flowers, bees, honey, and structures glow.
- **Day cycle:** cozy farming, soft light, relaxed pace.
- **Night cycle:** aurora skies, bioluminescent flora, higher risk/intensity — changes rules, not just visuals.

## 3. Core Loop (Redesigned)
1. **Lumens Forage / Swarm:** Lumens harvest pollen from flowers.
2. **Pollen Orbs:** Harvesting drops physical glowing orbs on the grass.
3. **Keeper Vacuum:** The player walks around to vacuum up the Pollen Orbs into their pack.
4. **Hive Deposit:** The player walks to the Hive zone to deposit pollen.
5. **Honey Jars:** The Hive refines pollen and pops out physical Honey Jars on the ground.
6. **Honey Collection:** The player collects the Honey Jars to add honey to their wallet.
7. **Upgrades & Investing:** Spend honey on upgrades or invest in the Honey Market / Speculator wheel.

## 4. Skills & Optimisation Systems
- **Bloom Chains** — Run through glowing Lumens in sequence to connect them into a glowing network, multiplying harvest yields.
- **Swarm Toggle (Spacebar):** Switch Lumens between:
  - *Forage Mode:* Lumens fly freely across the Skygarden.
  - *Swarm Mode:* Lumens trail behind you in a chain, harvesting nearby flowers.

## 5. The Pollen Exchange & Honey Speculator
- **Physical Trading Post:** Walking near the shop cart opens the Market UI.
- **Line Charts:** Live running charts with neon gradients showing asset histories.
- **News Ticker:** Real-time scrolling news events that alter stock trends and volatility.
- **Honey Speculator:** Spin a high-stakes wheel to gamble honey. Multipliers:
  - **0x:** Lose bet.
  - **0.5x:** Lose half.
  - **1.2x:** Safe collection.
  - **2.0x:** Double comb.
  - **5.0x:** Jackpot.

## 6. Synthesized Audio
- Fully custom sound effects and ambient pad music generated in code via the Web Audio API.

---

## MVP Specs (This web build)
- Player movement & active vacuum radius.
- Glowing flowers with 4-phase efficiency states.
- Autonomous/swarm Lumens.
- Physics-based Pollen Orbs and Honey Jars.
- Hive refinery & HPS tracker.
- Proximity shop slide-in triggers.
- Live stock exchange charts and news ticker.
- Honey Speculator roulette wheel.
- Web Audio API Synthesizer (Music & SFX).
