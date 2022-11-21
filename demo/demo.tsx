import { css } from '../src'
import { ClsStyles } from './demo.cssm'

const cls: ClsStyles = css`
  .console {
    font-size: large;
    font-size: 12px;
  }
`

const cls2 = css`
  .abcd {
    background: world;
  }

  .hello-world {
    color: default;
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
