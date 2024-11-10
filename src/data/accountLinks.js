import { FaMoneyBillTransfer } from 'react-icons/fa6';
import { GiPayMoney } from 'react-icons/gi';
import { FiPhoneCall } from 'react-icons/fi';
import { RiWifiFill } from 'react-icons/ri';
import { TbMoneybag } from 'react-icons/tb';
import { MdSupportAgent } from 'react-icons/md';
import { FaFileDownload } from 'react-icons/fa';

const iconBoxes = [
	{
		text: 'Interbank Transfer',
		iconName: FaMoneyBillTransfer,
		url: '/interbank-transfer',
	},
	{
		text: 'Intrabank Transfer',
		iconName: 'IntrabankIcon',
		url: '/intrabank-transfer',
	},
	{
		text: 'Buy Airtime',
		iconName: FiPhoneCall,
		url: '/buy-airtime',
	},
	{
		text: 'Buy Data',
		iconName: RiWifiFill,
		url: '/buy-data',
	},
	{
		text: 'Short-term Loan',
		iconName: TbMoneybag,
		url: '/short-term-loan',
	},
	{
		text: 'Pay For Bills & Utilities',
		iconName: GiPayMoney,
		url: '/pay-bills',
	},
	{
		text: 'Generate Statement',
		iconName: FaFileDownload,
		url: '/generate-statement',
	},
	{
		text: 'Complaints & Supports',
		iconName: MdSupportAgent,
		url: '/complaints-support',
	},
];
