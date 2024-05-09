'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Link } from '@mui/material';
import {
	IconPlusCircle,
	IconMinusCircle,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import { useTheme } from '@emotion/react';
import { Subcomment } from '@/components';

const CommentCard = () => {
	const theme = useTheme();
	const showMoreRef = useRef(null);
	const commentCardRef = useRef(null);

	const [isExpanded, setIsExpanded] = useState(false);
	const [showMoreTopPosition, setShowMoreTopPosition] = useState(0);
	const [commentCardTopPosition, setCommentCardTopPosition] = useState(0);

	const [windowWidth, setWindowWidth] = useState(0);

	useEffect(() => {
		if (window) {
			setWindowWidth(window?.innerWidth);
		}
		const handleResize = () => {
			setWindowWidth(window?.innerWidth);
		};

		window?.addEventListener('resize', handleResize);

		return () => window?.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (showMoreRef.current) {
			const showMore = showMoreRef.current.getBoundingClientRect();
			setShowMoreTopPosition(showMore.top);

			const commentCard = commentCardRef.current.getBoundingClientRect();
			setCommentCardTopPosition(commentCard.top);
		}
	}, [showMoreRef, windowWidth, isExpanded]);

	return (
		<Card
			ref={commentCardRef}
			sx={{
				position: 'relative',
			}}
		>
			<CardContent>
				<Box display="flex">
					<Box
						width="80px"
						display="flex"
						flexDirection="column"
						alignItems="center"
					>
						<Box
							sx={{
								minWidth: '24px',
								width: '24px',
								minHeight: '24px',
								height: '24px',
								backgroundColor: 'rgba(0, 0, 0, 0.1)',
								borderRadius: '50%',
							}}
						></Box>
						<Box
							sx={{
								width: '1px',
								height: '100%',
								backgroundColor: 'rgba(0, 0, 0, 0.1)',
								marginTop: '4px',
							}}
						></Box>
						<Box
							sx={{
								py: '4px',
								position: 'absolute',
								maxHeight: '32px',
								top: `${
									showMoreTopPosition -
									commentCardTopPosition -
									10
								}px`,
								backgroundColor: '#fff',
							}}
						>
							{isExpanded ? (
								<IconMinusCircle
									width="24"
									height="24"
									fill={theme.palette.primary.main}
								/>
							) : (
								<IconPlusCircle
									width="24"
									height="24"
									fill={theme.palette.primary.main}
								/>
							)}
						</Box>
					</Box>
					<Box
						sx={{
							width: '100%',
						}}
					>
						<Typography variant="h6">@Authourusername</Typography>
						<Typography variant="overline">
							10/01/2024 - 10:48AM UTC
						</Typography>
						<Typography
							variant="body2"
							sx={{
								maxWidth: '100%',
								wordWrap: 'break-word',
							}}
						>
							Lorem ipsum dolor sit amet consectetur. Tempus sed
							ut rutrum aliquam. Morbi tristique platea egestas
							posuere dignissim iaculis eu pellentesque. Eget
							condimentum enim enim enim commodo semper. Lacinia
							massa cursus elementum nec nisi pretium ac non. Id
							egestas sollicitudin leo lectus porta elementum
							libero non morbi.
							{isExpanded &&
								'Lorem ipsum dolor sit amet consectetur. Tempus sed ut rutrum aliquam. Morbi tristique platea egestas posuere dignissim iaculis eu pellentesque. Eget condimentum enim enim enim commodo semper. Lacinia massa cursus elementum nec nisi pretium ac non. Id egestas sollicitudin leo lectus porta elementum libero non morbi. Urna morbi maecenas consectetur non lacus faucibus. Pellentesque vulputate in consectetur lectus ullamcorper mass...'}
						</Typography>

						<Box mt={2}>
							<Link
								ref={showMoreRef}
								onClick={() => setIsExpanded(!isExpanded)}
								sx={{
									cursor: 'pointer',
								}}
							>
								{isExpanded ? 'Show less' : 'Read full comment'}
							</Link>
						</Box>

						<Subcomment />
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};

export default CommentCard;
