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

const Header = ({ header, userDefault, title, token }: HeaderProps) => {

    return (
        <header className='static z-999 flex w-full bg-white drop-shadow-none'>
            <div className='flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11'>
                <div className='flex items-center gap-2 sm:gap-4'>
                    <Link href='/'>
                        <div className='flex flex-shrink-0 items-center gap-2 text-white'>
                        <Image
                            className="object-cover object-center"
                            src="/images/logo.png"
                            alt="Barrier Logo"
                            width={150}
                            height={150}
                            sizes="(max-width: 768px) 150px, (max-width: 1200px) 250px, 100px"
                            priority
                        />
                            <span className='hidden flex-shrink-0 lg:flex text-2xl font-semibold'>{!header ? "Barrier Gate" : header}</span>
                        </div>
                    </Link>
                </div>


                <div className='flex items-center gap-3 2xsm:gap-7'>
                    <ul className='flex items-center gap-2 2xsm:gap-4'>
                        {/* <!-- Dark Mode Toggler --> */}
                        {/* <DarkModeSwitcher /> */}
                        {/* <!-- Dark Mode Toggler --> */}

                        {/* <!-- Notification Menu Area --> */}
                        <DropdownUser userDefault={userDefault} token={token} />
                        {/* <!-- Notification Menu Area --> */}

                        <div className="relative h-10 mx-3">
                            <div className="border-l-2 border-gray-4 absolute inset-y-0"></div>
                        </div>

                        {/* <!-- Chat Notification Area --> */}
                        <DropdownNotification />
                        <DropdownNotification />
                    </ul>

                    {/* <!-- User Area --> */}
                    {/* <!-- User Area --> */}
                </div>
            </div>
        </header>
    )
}

export default Header
