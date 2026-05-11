import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.05) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      >
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: 'white',
              letterSpacing: '0.1em',
              marginBottom: 20,
              textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
            }}
          >
            SURYA SUNDAR
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 36,
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: 40,
              letterSpacing: '0.05em',
            }}
          >
            Data Engineer & Full Stack Developer
          </div>

          {/* Skills Row 1 */}
          <div
            style={{
              display: 'flex',
              gap: 20,
              marginBottom: 15,
            }}
          >
            {['Apache Spark', 'Databricks', 'ETL Pipelines'].map((skill) => (
              <div
                key={skill}
                style={{
                  padding: '12px 24px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 20,
                  letterSpacing: '0.05em',
                }}
              >
                {skill}
              </div>
            ))}
          </div>

          {/* Skills Row 2 */}
          <div
            style={{
              display: 'flex',
              gap: 20,
              marginBottom: 40,
            }}
          >
            {['React', 'Next.js', 'Python', 'Machine Learning'].map((skill) => (
              <div
                key={skill}
                style={{
                  padding: '12px 24px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 20,
                  letterSpacing: '0.05em',
                }}
              >
                {skill}
              </div>
            ))}
          </div>

          {/* URL */}
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.1em',
            }}
          >
            portfoliowebsite-kohl-eta.vercel.app
          </div>
        </div>

        {/* Corner Accents */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            width: 40,
            height: 40,
            borderTop: '3px solid rgba(255, 255, 255, 0.4)',
            borderLeft: '3px solid rgba(255, 255, 255, 0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 40,
            height: 40,
            borderTop: '3px solid rgba(255, 255, 255, 0.4)',
            borderRight: '3px solid rgba(255, 255, 255, 0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            width: 40,
            height: 40,
            borderBottom: '3px solid rgba(255, 255, 255, 0.4)',
            borderLeft: '3px solid rgba(255, 255, 255, 0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            width: 40,
            height: 40,
            borderBottom: '3px solid rgba(255, 255, 255, 0.4)',
            borderRight: '3px solid rgba(255, 255, 255, 0.4)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
