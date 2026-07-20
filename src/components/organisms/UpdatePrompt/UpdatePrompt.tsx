import { Button } from '../../atoms/Button/Button'
import { Text } from '../../atoms/Text/Text'
import { Card } from '../../molecules/Card/Card'
import styles from './UpdatePrompt.module.css'

interface UpdatePromptProps {
  onRefresh: () => void
  onDismiss: () => void
}

export function UpdatePrompt({ onRefresh, onDismiss }: UpdatePromptProps) {
  return (
    <div className={styles.wrapper} role="status">
      <Card elevation="raised" className={styles.card}>
        <Text size="sm">A new version of Logiclings is available.</Text>
        <div className={styles.actions}>
          <Button size="sm" variant="ghost" onClick={onDismiss}>
            Later
          </Button>
          <Button size="sm" variant="primary" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      </Card>
    </div>
  )
}
