import { Box, Typography, useTheme } from '@mui/material'
import useBeatTempo from '../../../hooks/useBeatTempo'

const BeatDisplay = () => {
  const theme = useTheme()
  const { bpm, beatNow, isStable, confidence, displayBpm } = useBeatTempo()

  if (bpm === 0 && displayBpm === 0) return null

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        mr: 1,
        px: 1,
        py: 0.25,
        borderRadius: 1,
        backgroundColor: 'rgba(255,255,255,0.08)'
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: beatNow
            ? theme.palette.success.main
            : isStable
              ? theme.palette.warning.main
              : theme.palette.grey[500],
          transition: 'background-color 0.05s',
          boxShadow: beatNow ? `0 0 6px ${theme.palette.success.main}` : 'none'
        }}
      />
      <Typography
        variant="body2"
        sx={{
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
          minWidth: 36,
          textAlign: 'right',
          color: isStable ? 'inherit' : theme.palette.text.secondary
        }}
      >
        {Math.round(displayBpm || bpm)}
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: theme.palette.text.secondary, fontSize: '0.7rem' }}
      >
        BPM
      </Typography>
      {confidence > 0 && (
        <Box
          sx={{
            width: 20,
            height: 3,
            borderRadius: 1,
            backgroundColor: theme.palette.grey[700],
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              width: `${confidence * 100}%`,
              height: '100%',
              backgroundColor: theme.palette.success.main,
              transition: 'width 0.3s'
            }}
          />
        </Box>
      )}
    </Box>
  )
}

export default BeatDisplay
