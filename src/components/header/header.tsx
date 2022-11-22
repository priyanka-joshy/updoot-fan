import styles from './header.module.scss';
import UpdootSVG from '../../assets/updoot.svg';
import SearchSVG from '../../assets/search.svg';
import WalletSVG from '../../assets/wallet.svg';
import BellSVG from '../../assets/bell.svg';
import SettingsSVG from '../../assets/settings.svg';

const Header = () => {
  return (
    <div className={styles.container}>
      <UpdootSVG className={styles.updoot} />
      <div className={styles.utilContainer}>
        <button>
          <SearchSVG />
        </button>
        <button>
          <WalletSVG />
        </button>
        <button>
          <BellSVG />
        </button>
        <button>
          <SettingsSVG />
        </button>
      </div>
    </div>
  );
};

export default Header;
