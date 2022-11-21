import { css } from '.'
import { ClsStyles } from './demo.cssm'

const cls: ClsStyles = css`
  .console {
    font-size: large;
  }
`
function Demo() {
  return (
    <div className={cls.console}>
      {/*  */}
      The font-size is large
    </div>
  )
}
