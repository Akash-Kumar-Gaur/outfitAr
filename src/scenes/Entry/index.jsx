import React from "react";
import styles from './index.module.scss';
import ytLogo from '../../assests/ytLogo.png';
import start from '../../assests/start.png';
import membership from '../../assests/membership.png';
import bag from '../../assests/bag.png';
import { pixelsToVH, pixelsToVW } from "../../App";

function Entry() {
  return (
    <div className={styles.entryPage}>
      <div className={styles.content} style={{
        maxWidth: pixelsToVW(803)
      }}>
        <div className={styles.mainLogo} style={{
          width: pixelsToVW(803)
        }}>
          <img src={ytLogo} alt="atsa" />
        </div>
        <div className={styles.text}>
          <div className={styles.headline} style={{
            fontSize: pixelsToVH(80)
          }}>
            <span style={{ fontSize: pixelsToVH(50) }}>Step Into Style with</span><br />
            YouTube AR Try-On!
            <div className={styles.leftAbs} style={{
              width: pixelsToVW(88.5),
              height: 'auto',
              top: pixelsToVH(-100),
              left: pixelsToVW(-60)
            }}>
              <img src={membership} alt="membership" />
            </div>
            <div className={styles.rightAbs} style={{
              width: pixelsToVW(161.3),
              height: 'auto',
              top: pixelsToVH(-120),
              right: pixelsToVW(-60)
            }}>
              <img src={bag} alt="bag" />
            </div>
          </div>
          <div className={styles.tagline} style={{ fontSize: pixelsToVH(47), marginTop: pixelsToVH(50) }}>
            Experience fashion like never before with<br />a virtual try-on.
          </div>
        </div>
        <div className={styles.action} style={{
          width: pixelsToVW(590),
          height: 'auto'
        }}>
          <img src={start} alt="start" />
        </div>

      </div>
    </div>
  )
}

export default Entry;