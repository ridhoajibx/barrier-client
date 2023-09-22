// import LogoIcon from '../images/logo/logo-icon.svg'
// import DropdownNotification from '../../Dropdown/DropdownNotification'
// import DropdownUser from '../../Dropdown/DropdownUser'
// import DarkModeSwitcher from '../../DarkMode/DarkModeSwitcher'
// import { MdMuseum } from 'react-icons/md'
// import Icon from '../../Icon'
import DropdownNotification from '@/components/dropdown/DropdownNotification';
import DropdownUser from '@/components/dropdown/DropdownUser';
import Image from 'next/image';
import Link from 'next/link'
import { Dispatch, SetStateAction } from 'react'

type HeaderProps = {
    header?: string;
    userDefault?: string;
    title?: any;
    token?:any;
    icons?: any;
}

const Navbar = ({ header, userDefault, title, token }: HeaderProps) => {

    return (
        <header className='sticky top-0 z-99 flex w-full bg-primary drop-shadow-none text-gray'>
            <div className='flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11'>
                <div className='flex items-center gap-3 2xsm:gap-7'>
                    <ul className='flex items-center gap-2 2xsm:gap-4'>
                        <li>
                            <Link href={'/'} className='px-4 py-2'>
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href={'/log-data'} className='px-4 py-2'>
                                Log Data
                            </Link>
                        </li>
                        <li>
                            <Link href={'/rfid'} className='px-4 py-2'>
                                RFID
                            </Link>
                        </li>
                        <li>
                            <Link href={'/vehicle-type'} className='px-4 py-2'>
                                Vehicle Type
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Navbar
