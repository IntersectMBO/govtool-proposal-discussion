'use client';
import { useRef, useState, useEffect } from 'react';
import { ProposalCard } from '@/components';
import { settings } from '@/lib/carouselSettings';
import {
	IconCheveronLeft,
	IconCheveronRight,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import { getProposals } from '@/lib/api';
import Slider from 'react-slick';

const ProposalsList = () => {
	const sliderRef = useRef(null);

	const [showAll, setShowAll] = useState(false);

	const [proposalsList, setProposalsList] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [mounted, setMounted] = useState(false);

	const fetchProposals = async () => {
		try {
			let query = `pagination[page]=${currentPage}&pagination[pageSize]=25&sort[createdAt]=desc`;
			const { proposals, pgCount } = await getProposals(query);
			if (!proposals) return;

			setProposalsList((prev) => [...prev, ...proposals]);
			setPageCount(pgCount);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!mounted) {
			setMounted(true);
		} else {
			fetchProposals();
		}
	}, [mounted, currentPage]);
	return (
		<Box overflow={'hidden'}>
			{proposalsList?.length > 0 ? (
				<div>
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
								Info
							</Typography>
							<Button
								variant="outlined"
								onClick={() => setShowAll((prev) => !prev)}
							>
								{showAll ? 'Show less' : 'Show all'}
							</Button>
						</Box>

						{!showAll && (
							<Box display={'flex'} alignItems={'center'}>
								<IconButton
									onClick={() =>
										sliderRef.current.slickPrev()
									}
								>
									<IconCheveronLeft width={20} height={20} />
								</IconButton>
								<IconButton
									onClick={() =>
										sliderRef.current.slickNext()
									}
								>
									<IconCheveronRight width={20} height={20} />
								</IconButton>
							</Box>
						)}
					</Box>

					{showAll ? (
						<Box>
							<Grid
								container
								spacing={2}
								paddingY={4}
								paddingX={2}
							>
								{proposalsList?.map((proposal, index) => (
									<Grid
										item
										key={index}
										xs={12}
										sm={6}
										md={4}
									>
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
										onClick={() =>
											setCurrentPage((prev) => prev + 1)
										}
									>
										Load more
									</Button>
								</Box>
							)}
						</Box>
					) : (
						<Box paddingRight={{ md: 2.2 }}>
							<Slider ref={sliderRef} {...settings}>
								{proposalsList?.map((proposal, index) => (
									<Box
										paddingLeft={2}
										paddingRight={{
											xs: 2,
											sm: 0,
											md: 0,
										}}
										paddingY={4}
										key={index}
										height={'100%'}
									>
										<ProposalCard proposal={proposal} />
									</Box>
								))}

								<Box></Box>
								<Box></Box>
								<Box></Box>
								<Box></Box>
							</Slider>
						</Box>
					)}
				</div>
			) : (
				<Typography variant="h5">No proposals found</Typography>
			)}
		</Box>
	);
};

export default ProposalsList;
