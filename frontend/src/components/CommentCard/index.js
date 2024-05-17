'use client';

import { getComments } from '@/lib/api';
import { formatPollDateDisplay } from '@/lib/utils';
import { useTheme } from '@emotion/react';
import {
	IconMinusCircle,
	IconPlusCircle,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import { Box, Card, CardContent, Link, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
const CommentCard = ({ comment }) => {
	const theme = useTheme();
	const maxLength = 128;
	const sliceString = (str) => {
		if (str.length > maxLength) {
			return str.slice(0, maxLength - 3) + '...';
		}
		return str;
	};

	const CommentContent = ({ comment }) => {
		const showMoreRef = useRef(null);
		const commentCardRef = useRef(null);
		const [isExpanded, setIsExpanded] = useState(false);
		const [showSubcomments, setShowSubcomments] = useState(false);
		const [showMoreTopPosition, setShowMoreTopPosition] = useState(0);
		const [commentCardTopPosition, setCommentCardTopPosition] = useState(0);
		const [windowWidth, setWindowWidth] = useState(0);
		const [subcommnetsList, setSubcommnetsList] = useState([]);

		const loadSubComments = async () => {
			try {
				let query = `filters[comment_parent_id]=${comment?.id}&sort[createdAt]=desc`;
				const { comments, pgCount, total } = await getComments(query);
				if (!comments) return;

				setSubcommnetsList(comments);
			} catch (error) {
				console.error(error);
			}
		};

		useEffect(() => {
			if (showSubcomments) {
				loadSubComments();
			} else {
				setSubcommnetsList([]);
			}
		}, [showSubcomments]);

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
				const commentCard =
					commentCardRef.current.getBoundingClientRect();
				setCommentCardTopPosition(commentCard.top);
			}
		}, [showMoreRef, windowWidth, isExpanded]);
		return (
			<Box
				display="flex"
				mt={2}
				ref={commentCardRef}
				sx={{
					position: 'relative',
				}}
			>
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

					{comment?.attributes?.comment_has_replays && (
						<Box
							sx={{
								py: '4px',
								position: 'absolute',
								maxHeight: '32px',
								top: `${
									showMoreTopPosition -
									commentCardTopPosition +
									20
								}px`,
								backgroundColor: '#fff',
							}}
						>
							{showSubcomments ? (
								<IconMinusCircle
									width="24"
									height="24"
									fill={theme.palette.primary.main}
									onClick={() =>
										setShowSubcomments(!showSubcomments)
									}
								/>
							) : (
								<IconPlusCircle
									width="24"
									height="24"
									fill={theme.palette.primary.main}
									onClick={() =>
										setShowSubcomments(!showSubcomments)
									}
								/>
							)}
						</Box>
					)}
				</Box>
				<Box
					sx={{
						width: '100%',
					}}
				>
					<Typography variant="h6">@Authourusername</Typography>
					<Typography variant="overline">
						{formatPollDateDisplay(comment?.attributes?.createdAt)}
					</Typography>
					<Typography
						variant="body2"
						sx={{
							maxWidth: '100%',
							wordWrap: 'break-word',
						}}
						ref={showMoreRef}
					>
						{isExpanded
							? comment?.attributes?.comment_text
							: sliceString(comment?.attributes?.comment_text) ||
							  ''}
					</Typography>

					{comment?.attributes?.comment_text?.length > maxLength && (
						<Box mt={2}>
							<Link
								onClick={() => setIsExpanded(!isExpanded)}
								sx={{
									cursor: 'pointer',
								}}
							>
								{isExpanded ? 'Show less' : 'Read full comment'}
							</Link>
						</Box>
					)}
					{subcommnetsList?.map((subcomment, index) => (
						<CommentContent key={index} comment={subcomment} />
					))}
				</Box>
			</Box>
		);
	};
	return (
		<Card
			sx={{
				position: 'relative',
			}}
		>
			<CardContent>
				<CommentContent comment={comment} />
			</CardContent>
		</Card>
	);
};
export default CommentCard;
