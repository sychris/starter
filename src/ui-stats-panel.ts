import combatTracker from './combatTracker'
import formatDuration from './formatDuration'
import killTracker from './killTracker'
import lootTracker from './lootTracker'

function removeStatsPanel() {
  if (!window.top) {
    return
  }

  let statsPanel: HTMLDivElement | null = window.top.document.querySelector('#statsPanel')

  if (statsPanel) {
    statsPanel.remove()
  }
}

const stats = [
  [
    {
      label: 'Runtime',
      stats: [
        (runtime: number) => formatDuration(runtime, true),
      ],
    },
    {
      label: 'Idle',
      stats: [
        (runtime: number) => dw.character.combat ? '-' : formatDuration(Math.max(0, Math.floor((Date.now() - combatTracker.idle) / 1000)), true),
      ],
    },
  ],
  [
    {
      label: 'Average Level',
      stats: [
        () => killTracker.kills > 0 ? `${(killTracker.levels / killTracker.kills).toLocaleString([], { maximumFractionDigits: 1 })}` : '-',
      ],
    },
    {
      label: 'Kills',
      stats: [
        () => `${killTracker.kills}`,
        (runtime: number) => `${(killTracker.kills * 60 * 60 / runtime).toLocaleString([], { maximumFractionDigits: 0 })}/h`,
      ],
    },
    {
      label: 'Skull Kills',
      stats: [
        () => `${killTracker.skullKills}`,
        (runtime: number) => `${(killTracker.skullKills * 60 * 60 * 24 / runtime).toLocaleString([], { maximumFractionDigits: 0 })}/d`,
      ],
    },
    {
      label: 'Boss Kills',
      stats: [
        () => `${killTracker.bossKills}`,
        (runtime: number) => `${(killTracker.bossKills * 60 * 60 * 24 * 7 / runtime).toLocaleString([], { maximumFractionDigits: 0 })}/w`,
      ],
    },
  ],
  [
    {
      label: 'Green drops',
      stats: [
        () => `${lootTracker.green}`,
        (runtime: number) => `${(lootTracker.green * 60 * 60 / runtime).toLocaleString([], { maximumFractionDigits: 0 })}/h`,
      ],
    },
    {
      label: 'Blue drops',
      stats: [
        () => `${lootTracker.blue}`,
        (runtime: number) => `${(lootTracker.blue * 60 * 60 * 24 / runtime).toLocaleString([], { maximumFractionDigits: 0 })}/d`,
      ],
    },
    {
      label: 'Purple drops',
      stats: [
        () => `${lootTracker.purple}`,
        (runtime: number) => `${(lootTracker.purple * 60 * 60 * 24 / runtime).toLocaleString([], { maximumFractionDigits: 0 })}/d`,
      ],
    },
    {
      label: 'Orange drops',
      stats: [
        () => `${lootTracker.orange}`,
        (runtime: number) => `${(lootTracker.orange * 60 * 60 * 24 / runtime).toLocaleString([], { maximumFractionDigits: 0 })}/d`,
      ],
    },
  ],
  [
    {
      label: 'Rune drops',
      stats: [
        () => `${lootTracker.rune}`,
        (runtime: number) => `${(lootTracker.rune * 60 * 60 / runtime).toLocaleString([], { maximumFractionDigits: 0 })}/h`,
      ],
    },
    {
      label: 'Wood drops',
      stats: [
        () => `${lootTracker.wood}`,
        (runtime: number) => `${(lootTracker.wood * 60 * 60 / runtime).toLocaleString([], { maximumFractionDigits: 0 })}/h`,
      ],
    },
    {
      label: 'Prism drops',
      stats: [
        () => `${lootTracker.prism}`,
        (runtime: number) => `${(lootTracker.prism * 60 * 60 / runtime).toLocaleString([], { maximumFractionDigits: 0 })}/h`,
      ],
    },
  ],
]

function addStatsPanel() {
  if (!window.top) {
    return
  }

  const ui = window.top.document.querySelector('#ui')
  if (!ui) {
    return
  }

  const statsPanel = window.top.document.createElement('div')
  statsPanel.id = 'statsPanel'
  statsPanel.className = 'position-absolute top-50 start-50 ui ui-content translate-middle'
  statsPanel.style.width = '500px'

  ui.appendChild(statsPanel)

  const maxStatsPerRow = Math.max(...stats.flatMap((group) => group.map((row) => row.stats.length)))

  statsPanel.innerHTML = `<div class="ui-content2">
    <table class="table mb-0">
      <tbody>
        ${stats.map((group, groupIdx) => group.map((row, rowIdx) => `
          <tr>
            <td class="text-alt border-0 p-0 pb-1${rowIdx === 0 && groupIdx !== 0 ? ' pt-2' : ''}">${row.label}</td>
            ${row.stats.map((_, statIdx, rowStats) => `
              <td class="text-end border-0 p-0 pb-1${rowIdx === 0 && groupIdx !== 0 ? ' pt-2' : ''}" colspan="${statIdx === rowStats.length - 1 ? maxStatsPerRow - statIdx : 1}" data-content="stat-${groupIdx}-${rowIdx}-${statIdx}"></td>
            `).join('')}
          </tr>
        `).join('')).join('')}
      </tbody>
    </table>
  </div>`
}

const startedAt = Date.now()

function showStats() {
  if (!window.top) {
    return
  }

  let statsPanel: HTMLDivElement | null = window.top.document.querySelector('#statsPanel')

  if (dw.draw) {
    removeStatsPanel()
    return
  }

  if (!statsPanel) {
    addStatsPanel()
  }

  const runtime = Math.max(1, Math.floor((Date.now() - startedAt) / 1000))

  stats.forEach((group, groupIdx) => group.forEach((row, rowIdx) => row.stats.forEach((stat, statIdx) => {
    const statElement = window.top?.document.querySelector(`[data-content="stat-${groupIdx}-${rowIdx}-${statIdx}"]`)
    if (!statElement) {
      return
    }

    statElement.innerHTML = stat(runtime)
  })))
}

window.addEventListener('unload', removeStatsPanel)

setInterval(showStats, 1000)
