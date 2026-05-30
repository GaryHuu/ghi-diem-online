import { useFormatCurrency } from '@/hooks';
import helpers from '@/utils/helpers';
import { PlayerLeaderBoard } from '@/utils/types';
import { alpha, Theme, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type FormatCurrency = (value: number) => string;

const FONT = "Inter, Roboto, -apple-system, 'Segoe UI', sans-serif";
const SCALE = 2;
const CARD_W = 600;
const HEADER_H = 150;
const ROW_H = 64;
const FOOTER_H = 72;
const PAD_X = 36;
const ANGLE = (-4 * Math.PI) / 180;

/**
 * Loads an image from a (Base64) source. Rejects on error so the caller can
 * fall back to a placeholder.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

function roundRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number,
): void {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}

/**
 * Truncates text with an ellipsis so it fits within maxWidth at the current font.
 */
function truncate(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
	if (ctx.measureText(text).width <= maxWidth) return text;
	const ellipsis = '…';
	let result = text;
	while (result.length > 0 && ctx.measureText(result + ellipsis).width > maxWidth) {
		result = result.slice(0, -1);
	}
	return result + ellipsis;
}

async function drawAvatar(
	ctx: CanvasRenderingContext2D,
	player: PlayerLeaderBoard,
	x: number,
	y: number,
	r: number,
	borderColor: string,
): Promise<void> {
	if (player.avatar) {
		try {
			const img = await loadImage(player.avatar);
			ctx.save();
			ctx.beginPath();
			ctx.arc(x, y, r, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();
			ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
			ctx.restore();
			ctx.beginPath();
			ctx.arc(x, y, r, 0, Math.PI * 2);
			ctx.lineWidth = 1.5;
			ctx.strokeStyle = borderColor;
			ctx.stroke();
			return;
		} catch {
			// fall through to placeholder
		}
	}
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fillStyle = helpers.stringToColor(player.name);
	ctx.fill();
	ctx.fillStyle = '#fff';
	ctx.font = `600 18px ${FONT}`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(helpers.getShortName(player.name), x, y + 1);
}

type RenderParams = {
	title: string;
	dateText: string;
	players: PlayerLeaderBoard[];
	theme: Theme;
	formatCurrency: FormatCurrency;
};

/**
 * Renders the polaroid-style standings card to an offscreen canvas using the
 * native Canvas 2D API (no external dependency). Colors come from the live MUI
 * theme so the card matches light/dark mode.
 */
async function renderShareCard({
	title,
	dateText,
	players,
	theme,
	formatCurrency,
}: RenderParams): Promise<HTMLCanvasElement> {
	if (document.fonts?.ready) {
		await document.fonts.ready;
	}

	const cardH = HEADER_H + players.length * ROW_H + FOOTER_H;
	const cos = Math.abs(Math.cos(ANGLE));
	const sin = Math.abs(Math.sin(ANGLE));
	const bboxW = CARD_W * cos + cardH * sin;
	const bboxH = CARD_W * sin + cardH * cos;
	const margin = 48;
	const canvasW = bboxW + margin * 2;
	const canvasH = bboxH + margin * 2;

	// Clamp the pixel scale so a very large roster cannot exceed browser canvas
	// limits (~4096px/side on mobile Safari), which would silently yield a blank image.
	const MAX_SIDE = 4096;
	const scale = Math.min(SCALE, MAX_SIDE / Math.max(canvasW, canvasH));

	const canvas = document.createElement('canvas');
	canvas.width = Math.round(canvasW * scale);
	canvas.height = Math.round(canvasH * scale);
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Canvas 2D context unavailable');
	ctx.scale(scale, scale);

	const { palette } = theme;
	const paper = palette.background.paper;
	const primary = palette.primary.main;
	const onPrimary = palette.primary.contrastText;
	const textColor = palette.text.primary;
	const subText = palette.text.secondary;

	// Background
	ctx.fillStyle = palette.background.default;
	ctx.fillRect(0, 0, canvasW, canvasH);

	// Rotate around the canvas center, then move origin to the card's top-left
	ctx.translate(canvasW / 2, canvasH / 2);
	ctx.rotate(ANGLE);
	ctx.translate(-CARD_W / 2, -cardH / 2);

	// Polaroid frame
	ctx.save();
	ctx.shadowColor = alpha(palette.common.black, 0.35);
	ctx.shadowBlur = 30;
	ctx.shadowOffsetY = 12;
	roundRect(ctx, 0, 0, CARD_W, cardH, 18);
	ctx.fillStyle = paper;
	ctx.fill();
	ctx.restore();

	// Title
	ctx.fillStyle = textColor;
	ctx.font = `700 40px ${FONT}`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText(title, CARD_W / 2, 70);

	// Date
	ctx.fillStyle = subText;
	ctx.font = `400 22px ${FONT}`;
	ctx.fillText(dateText, CARD_W / 2, 104);

	// Divider
	ctx.strokeStyle = alpha(primary, 0.25);
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(PAD_X, 126);
	ctx.lineTo(CARD_W - PAD_X, 126);
	ctx.stroke();

	// Rows
	for (let i = 0; i < players.length; i += 1) {
		const player = players[i];
		const cy = HEADER_H + i * ROW_H + ROW_H / 2;

		// Rank badge
		const badgeR = 16;
		const badgeX = PAD_X + badgeR;
		ctx.beginPath();
		ctx.arc(badgeX, cy, badgeR, 0, Math.PI * 2);
		ctx.fillStyle = primary;
		ctx.fill();
		ctx.fillStyle = onPrimary;
		ctx.font = `600 20px ${FONT}`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(String(i + 1), badgeX, cy + 1);

		// Avatar
		const avatarR = 22;
		const avatarX = badgeX + badgeR + 16 + avatarR;
		// eslint-disable-next-line no-await-in-loop
		await drawAvatar(ctx, player, avatarX, cy, avatarR, alpha(primary, 0.4));

		// Score (measured first so the name can be truncated to the remaining space)
		const scoreText = formatCurrency(player.score);
		ctx.font = `600 24px ${FONT}`;
		const scoreWidth = ctx.measureText(scoreText).width;
		const scoreRight = CARD_W - PAD_X;
		ctx.textAlign = 'right';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = textColor;
		ctx.fillText(scoreText, scoreRight, cy);

		// Name (truncated)
		const nameX = avatarX + avatarR + 16;
		const nameMaxW = scoreRight - scoreWidth - 24 - nameX;
		ctx.font = `500 24px ${FONT}`;
		ctx.textAlign = 'left';
		ctx.fillStyle = textColor;
		ctx.fillText(truncate(ctx, player.name, nameMaxW), nameX, cy);
	}

	return canvas;
}

/**
 * Builds the share-card image from the current standings and exposes a PNG
 * download. Generation runs while the dialog is open; the preview <img> and the
 * downloaded file come from the same canvas (one source of truth).
 */
function useShareCard(isOpen: boolean, players: PlayerLeaderBoard[], matchId?: number) {
	const theme = useTheme();
	const { t } = useTranslation();
	const { formatCurrency } = useFormatCurrency();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [dataUrl, setDataUrl] = useState('');
	const [isReady, setIsReady] = useState(false);
	const [hasError, setHasError] = useState(false);

	// Keep latest non-stable callbacks in refs so the effect depends only on data.
	const formatRef = useRef(formatCurrency);
	formatRef.current = formatCurrency;
	const tRef = useRef(t);
	tRef.current = t;

	useEffect(() => {
		if (!isOpen) {
			setDataUrl('');
			setIsReady(false);
			setHasError(false);
			canvasRef.current = null;
			return undefined;
		}

		let cancelled = false;
		(async () => {
			try {
				setIsReady(false);
				setHasError(false);
				const dateText = matchId ? dayjs(matchId).format('HH:mm DD/MM/YYYY') : '';
				const canvas = await renderShareCard({
					title: tRef.current('pages.playing.leaderboard'),
					dateText,
					players,
					theme,
					formatCurrency: formatRef.current,
				});
				if (cancelled) return;
				canvasRef.current = canvas;
				setDataUrl(canvas.toDataURL('image/png'));
				setIsReady(true);
			} catch {
				if (!cancelled) {
					setHasError(true);
					toast.error(tRef.current('components.shareCard.error'));
				}
			}
		})();

		return () => {
			cancelled = true;
		};
		// formatCurrency/t are read via refs to avoid re-running on their unstable
		// identity; palette.mode captures dark/light changes. Unit/language are not
		// reactive while the dialog is open (Settings is unreachable from here).
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, players, matchId, theme.palette.mode]);

	const download = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		try {
			canvas.toBlob((blob) => {
				if (!blob) {
					toast.error(tRef.current('components.shareCard.error'));
					return;
				}
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = matchId
					? `bang-xep-hang-${dayjs(matchId).format('YYYYMMDD-HHmm')}.png`
					: 'bang-xep-hang.png';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				// Defer revoke so the browser has read the blob before it is released
				// (revoking on the same tick can abort the download on some browsers).
				setTimeout(() => URL.revokeObjectURL(url), 0);
			}, 'image/png');
		} catch {
			toast.error(tRef.current('components.shareCard.error'));
		}
	}, [matchId]);

	return { dataUrl, isReady, hasError, download };
}

export default useShareCard;
