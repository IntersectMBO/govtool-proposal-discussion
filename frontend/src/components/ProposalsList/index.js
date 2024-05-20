'use client';

import React, { useRef, useState } from 'react';
import { Box, Typography, Button, IconButton, Grid } from '@mui/material';
import {
	IconCheveronLeft,
	IconCheveronRight,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import ProposalCard from '@/components/ProposalCard';
import Slider from 'react-slick';
import { settings } from '@/lib/carouselSettings';

const ProposalsList = ({ proposals }) => {
	const sliderRef = useRef(null);

	const [showAll, setShowAll] = useState(false);
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
						Info
					</Typography>
					<Button
						variant="outlined"
						onClick={() => setShowAll((prev) => !prev)}
					>
						Show all
					</Button>
				</Box>

				{!showAll && (
					<Box display={'flex'} alignItems={'center'}>
						<IconButton
							onClick={() => sliderRef.current.slickPrev()}
						>
							<IconCheveronLeft width={24} height={24} />
						</IconButton>
						<IconButton
							onClick={() => sliderRef.current.slickNext()}
						>
							<IconCheveronRight width={24} height={24} />
						</IconButton>
					</Box>
				)}
			</Box>

			{showAll ? (
				<Box>
					<Grid container spacing={2} paddingY={4} paddingX={2}>
						{proposals?.map((proposal, index) => (
							<Grid item key={index} xs={12} sm={6} md={4}>
								<ProposalCard proposal={proposal} />
							</Grid>
						))}
					</Grid>
				</Box>
			) : (
				<Box>
					<Slider ref={sliderRef} {...settings}>
						{proposals?.map((proposal, index) => (
							<Box paddingLeft={2} paddingY={4} key={index}>
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
		</Box>
	);
};

export default ProposalsList;