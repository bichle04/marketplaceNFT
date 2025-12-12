import { Link } from 'react-router-dom'
import timelessLogo from '../assets/timeless.png'
import { connectWallet } from '../Blockchain.Services'
import { useGlobalState, truncate } from '../store'

const Header = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')

  return (
    <nav className="w-4/5 flex md:justify-center justify-between items-center py-4 mx-auto">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <Link to="/">
          <img className="w-32 cursor-pointer" src={timelessLogo} alt="Timeless Logo" />
        </Link>
      </div>

      <ul className="md:flex-[0.5] text-white md:flex hidden list-none flex-row justify-between items-center">
        <li className="mx-4 cursor-pointer"><Link to="/market">Market</Link></li>
        <li className="mx-4 cursor-pointer">Artist</li>
        <li className="mx-4 cursor-pointer">Features</li>
        <li className="mx-4 cursor-pointer">Community</li>
      </ul>

      {connectedAccount ? (
        <Link
          to="/profile"
          className="flex items-center gap-2 shadow-xl shadow-black 
               bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full cursor-pointer"
        >
          <img
            src={`https://api.dicebear.com/9.x/identicon/svg?seed=${connectedAccount}`}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-white md:text-xs">
            {truncate(connectedAccount, 4, 4, 11)}
          </span>
        </Link>
      ) : (
        <button
          className="shadow-xl shadow-black text-white bg-[#e32970] hover:bg-[#bd255f] md:text-xs p-2 rounded-full cursor-pointer"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </nav>
  )
}

export default Header
