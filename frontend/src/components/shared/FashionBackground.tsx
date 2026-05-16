'use client';

/**
 * Unified fashion background component used across all microsites.
 * Provides a subtle grid of fashion imagery + dot pattern for brand consistency.
 */
const imageIds = ['291762','985635','1036623','1755428','1021693','1187957','2220316','1043474','1192609','2752045','1681010','3760514'];

export function FashionBackground() {
  return (
    <>
      {/* Fashion image grid - very subtle */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.07]" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-1">
          {imageIds.map((id, i) => (
            <div key={i} className="overflow-hidden rounded-lg">
              <img
                src={`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1`}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Dot pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ zIndex: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, #C4956A 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />
    </>
  );
}

export default FashionBackground;
