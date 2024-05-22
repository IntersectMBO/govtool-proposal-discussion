'use client';

import { ProposalCard } from '@/components';
import { getProposals } from '@/lib/api';
import { settings } from '@/lib/carouselSettings';
import {
	IconCheveronLeft,
	IconCheveronRight,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import { useDebounce } from '@/lib/hooks';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';

const ProposalsList = ({
	governanceAction,
	searchText = '',
	sortType = 'desc',
}) => {
	const sliderRef = useRef(null);

	const [showAll, setShowAll] = useState(false);
	const [proposalsList, setProposalsList] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [mounted, setMounted] = useState(false);
	const debouncedSearchValue = useDebounce(searchText);

	const fetchProposals = async (reset = true, page) => {
		try {
			let query = `filters[$and][0][gov_action_type_id]=${
				governanceAction?.id
			}&filters[$and][1][prop_name][$containsi]=${
				debouncedSearchValue || ''
			}&pagination[page]=${page}&pagination[pageSize]=3&sort[createdAt]=${sortType}&populate[0]=proposal_links`;
			const { proposals, pgCount } = await getProposals(query);
			if (!proposals) return;

			if (reset) {
				setProposalsList(proposals);
			} else {
				setProposalsList((prev) => [...prev, ...proposals]);
			}

			setPageCount(pgCount);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!mounted) {
			setMounted(true);
		} else {
			fetchProposals(true, 1);
			setCurrentPage(1);
		}
	}, [mounted, debouncedSearchValue, sortType]);

	return (
		<Box overflow={'hidden'}>
			<Box
				display={'flex'}
				alignItems={'center'}
				justifyContent={'space-between'}
			>
				<Box display={'flex'} alignItems={'center'}>
					<Typography
						variant="h5"
						component="h2"
						color="text.black"
						marginRight={2}
					>
						{governanceAction?.attributes?.gov_action_type_name}
					</Typography>
					{proposalsList?.length > 0 && (
						<Button
							variant="outlined"
							onClick={() => setShowAll((prev) => !prev)}
						>
							{showAll ? 'Show less' : 'Show all'}
						</Button>
					)}
				</Box>

				{!showAll && proposalsList?.length > 0 && (
					<Box display={'flex'} alignItems={'center'}>
						<IconButton
							onClick={() => sliderRef.current.slickPrev()}
						>
							<IconCheveronLeft width={20} height={20} />
						</IconButton>
						<IconButton
							onClick={() => sliderRef.current.slickNext()}
						>
							<IconCheveronRight width={20} height={20} />
						</IconButton>
					</Box>
				)}
			</Box>
			{proposalsList?.length > 0 ? (
				showAll ? (
					<Box>
						<Grid container spacing={2} paddingY={4}>
							{proposalsList?.map((proposal, index) => (
								<Grid item key={index} xs={12} sm={6} md={4}>
									<ProposalCard proposal={proposal} />
								</Grid>
							))}
						</Grid>

						{currentPage < pageCount && (
							<Box
								marginY={2}
								display={'flex'}
								justifyContent={'flex-end'}
							>
								<Button
									onClick={() => {
										fetchProposals(false, currentPage + 1);
										setCurrentPage((prev) => prev + 1);
									}}
								>
									Load more
								</Button>
							</Box>
						)}
					</Box>
				) : (
					<Box>
						<Slider ref={sliderRef} {...settings}>
							{proposalsList?.map((proposal, index) => (
								<Box paddingY={4} key={index} height={'100%'}>
									<ProposalCard proposal={proposal} />
								</Box>
							))}

							<Box></Box>
							<Box></Box>
							<Box></Box>
							<Box></Box>
						</Slider>
					</Box>
				)
			) : (
				<Typography variant="h6" mt={3} mb={4}>
					No proposals found
				</Typography>
			)}
		</Box>
	);
};

export default ProposalsList;
