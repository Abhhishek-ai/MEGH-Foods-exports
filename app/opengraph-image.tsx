import { ImageResponse } from 'next/og'

export const alt = 'Megh Foods — Rooted in India, Loved Worldwide'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1B4FD8 0%, #0F2F84 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              fontWeight: 900,
              letterSpacing: '-1px',
              color: '#ffffff',
            }}
          >
            MEGH
          </div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 900,
              letterSpacing: '-1px',
              color: '#9CCB3B',
            }}
          >
            FOODS
          </div>
        </div>

        <div
          style={{
            fontSize: '40px',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '16px',
            color: '#ffffff',
          }}
        >
          Rooted in India, Loved Worldwide.
        </div>

        <div
          style={{
            fontSize: '20px',
            color: '#D9E4FD',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.5,
          }}
        >
          Authentic Traditional Flours • Millets • Vrat Flours • Poha • Sabudana • Snacks • Global Export Supply
        </div>

        <div
          style={{
            marginTop: '40px',
            padding: '8px 24px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: '#9CCB3B',
            fontSize: '16px',
            fontWeight: 700,
          }}
        >
          Megh Overseas Pvt. Ltd. • Ahmedabad, Gujarat, India
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
