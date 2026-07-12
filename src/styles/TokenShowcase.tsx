import styles from './TokenShowcase.module.css'

const neutralColors = [
  '--color-bg',
  '--color-surface',
  '--color-surface-muted',
  '--color-text',
  '--color-text-muted',
  '--color-border',
  '--color-border-strong',
]

const semanticColors = [
  '--color-accent',
  '--color-accent-strong',
  '--color-accent-muted',
  '--color-success',
  '--color-warning',
  '--color-danger',
  '--color-info',
]

const trackColors = [
  '--color-track-frontend',
  '--color-track-backend',
  '--color-track-apis',
  '--color-track-databases',
  '--color-track-algorithms',
  '--color-track-system-design',
  '--color-track-networking',
  '--color-track-security',
  '--color-track-devops',
  '--color-track-ai-fundamentals',
  '--color-track-agentic-coding',
]

const fontSizes = [
  '--font-size-xs',
  '--font-size-sm',
  '--font-size-md',
  '--font-size-lg',
  '--font-size-xl',
  '--font-size-2xl',
  '--font-size-3xl',
]

const spacing = [
  '--space-2xs',
  '--space-xs',
  '--space-sm',
  '--space-md',
  '--space-lg',
  '--space-xl',
  '--space-2xl',
  '--space-3xl',
]

const radii = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-full']

function ColorSwatchGroup({ title, tokens }: { title: string; tokens: string[] }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.swatchGrid}>
        {tokens.map((token) => (
          <div key={token} className={styles.swatchCard}>
            <div
              className={styles.swatch}
              style={{ background: `var(${token})` }}
            />
            <code className={styles.tokenName}>{token}</code>
          </div>
        ))}
      </div>
    </section>
  )
}

export function TokenShowcase() {
  return (
    <div className={styles.showcase}>
      <ColorSwatchGroup title="Neutral colors" tokens={neutralColors} />
      <ColorSwatchGroup title="Semantic colors" tokens={semanticColors} />
      <ColorSwatchGroup title="Track accents" tokens={trackColors} />

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Typography scale</h3>
        {fontSizes.map((token) => (
          <p
            key={token}
            className={styles.typeSample}
            style={{ fontSize: `var(${token})` }}
          >
            {token} — Tiny games. Big developer instincts.
          </p>
        ))}
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Spacing scale</h3>
        <div className={styles.spacingList}>
          {spacing.map((token) => (
            <div key={token} className={styles.spacingRow}>
              <code className={styles.tokenName}>{token}</code>
              <div
                className={styles.spacingBar}
                style={{ width: `var(${token})` }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Radius scale</h3>
        <div className={styles.swatchGrid}>
          {radii.map((token) => (
            <div key={token} className={styles.swatchCard}>
              <div
                className={styles.radiusSample}
                style={{ borderRadius: `var(${token})` }}
              />
              <code className={styles.tokenName}>{token}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
