// Stub file for Media
import { LeftSidebar } from '../components/LeftSidebar';
import { RightSidebar } from '../components/RightSidebar';

export function Media() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono">
      <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
        <LeftSidebar />
      </div>
      <div className="col-span-1 lg:col-span-7 flex flex-col gap-8 min-w-0">
        <div className="mb-4 pb-4 border-b border-[var(--border)]">
          <h1 className="font-bold text-3xl mb-2 tracking-tighter uppercase">MEDIA</h1>
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">Images, videos, and presentations.</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm p-12 text-center text-xs text-[var(--text-secondary)] uppercase tracking-widest">
          $ status --media<br/><br/>
          &gt; OFFLINE. COMING SOON.
        </div>
      </div>
      <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
        <RightSidebar />
      </div>
    </div>
  );
}
