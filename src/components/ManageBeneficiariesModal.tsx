'use client';
import React, { useEffect, useState } from 'react';
import supabase from '@/helper/supabaseClient';
import { FaTrashAlt } from 'react-icons/fa';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface Beneficiary {
	id: number;
	first_name: string;
	last_name: string;
	account_number: string;
	// bank_name: string;
}

interface Props {
	isOpen: boolean;
	onClose: () => void;
	profileId: string;
	onUpdate?: () => void;
}

const ManageBeneficiariesModal = ({
	isOpen,
	onClose,
	profileId,
	onUpdate,
}: Props) => {
	const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);

	const itemsPerPage = 10;
	const totalPages = Math.ceil(beneficiaries.length / itemsPerPage);
	const paginatedBeneficiaries = beneficiaries.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	useEffect(() => {
		if (!isOpen || !profileId) return; // ← ensure profileId exists

		setCurrentPage(1); // reset page on open

		const fetchBeneficiaries = async () => {
			setLoading(true);

			const { data, error } = await supabase
				.from('beneficiaries')
				.select('id, first_name, last_name, account_number')
				.eq('profile_id', profileId);

			if (!error && data) {
				console.log('Fetched:', data); // ← debug check
				setBeneficiaries(data);
			} else {
				console.error('Error:', error?.message);
			}

			setLoading(false);
		};

		fetchBeneficiaries();
	}, [isOpen, profileId]);

	const deleteBeneficiary = async (id: number) => {
		const { error } = await supabase
			.from('beneficiaries')
			.delete()
			.eq('id', id);

		if (!error) {
			const updatedList = beneficiaries.filter((b) => b.id !== id);
			setBeneficiaries(updatedList);

			if (
				(currentPage - 1) * itemsPerPage >= updatedList.length &&
				currentPage > 1
			) {
				setCurrentPage(currentPage - 1);
			}

			// ✅ TRIGGER GLOBAL UPDATE HERE
			onUpdate?.();
		} else {
			alert('Failed to delete beneficiary');
		}
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4'>
			<div className='bg-white dark:bg-[var(--primary-dark)] rounded-lg w-full max-w-xl max-h-[80vh] overflow-y-auto p-4 md:p-6'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-[var(--primary)] dark:text-[var(--secondary-dark)] font-semibold text-lg'>
						Manage Beneficiaries
					</h2>
					<button
						onClick={onClose}
						className='text-gray-500 hover:text-black dark:hover:text-white'>
						Close
					</button>
				</div>

				{loading ? (
					<p className='text-center dark:text-white'>Loading...</p>
				) : beneficiaries.length === 0 ? (
					<p className='text-center text-gray-500 dark:text-white'>
						No beneficiaries found.
					</p>
				) : (
					<>
						{paginatedBeneficiaries.map((b) => (
							<div key={b.id}>
								<div className='item flex w-full  items-center flex-wrap justify-between p-4 bg-white dark:bg-[var(--card-bg-dark)] rounded-lg shadow-sm mb-4 text-wrap break-words'>
									<div className='info mb-2 sm:mb-0'>
										<p className='capitalize text-[var(--primary)] dark:text-[var(--secondary-dark)] font-semibold text-md'>
											{b.first_name} {b.last_name}
										</p>
										<p className='text-sm text-gray-600 dark:text-gray-300'>
											{b.account_number}
										</p>
									</div>
									<button
										onClick={() => deleteBeneficiary(b.id)}
										className='text-red-300 hover:text-red-500 transition-all duration-400 self-end sm:self-auto'>
										<FaTrashAlt />
									</button>
								</div>
							</div>
						))}

						{/* Pagination Controls */}
						<div className='flex justify-center mt-4 gap-4 items-center text-sm'>
							<button
								onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
								disabled={currentPage === 1}
								className={`p-2 rounded ${
									currentPage === 1
										? 'text-gray-400'
										: 'text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
								}`}>
								<IoChevronBack />
							</button>
							<span className='dark:text-white'>
								Page {currentPage} of {totalPages}
							</span>
							<button
								onClick={() =>
									setCurrentPage((p) => Math.min(p + 1, totalPages))
								}
								disabled={currentPage === totalPages}
								className={`p-2 rounded ${
									currentPage === totalPages
										? 'text-gray-400'
										: 'text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
								}`}>
								<IoChevronForward />
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default ManageBeneficiariesModal;
// This component allows users to manage their beneficiaries, including viewing, deleting, and paginating through them.
