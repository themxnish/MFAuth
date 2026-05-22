import { db } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditProfile from "@/app/components/editProfile";
import ProfileAvatar from "@/app/components/avatar/profileAvatar";

export default async function ProfilePage() {
    const user = await getUserFromToken();
    if (!user) {
      redirect("/login");
    }
  
    const data = await db.user.findUnique({
      where: { username: user.username },
      select: {
        id: true,
        username: true,
        avatar: true,
        isVerified: true
      },
    });

    if (!data || !data.username) {
      redirect("/login");
    }

    return (
      <div className='min-h-screen flex items-center justify-center px-4 py-10'>
        <div className='w-full max-w-xl rounded-3xl border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/30 p-6 backdrop-blur'>
          <div className='flex items-center gap-4'>
            <div className='h-20 w-20 shrink-0 rounded-full border border-white/15 bg-white/[0.05] p-1 overflow-hidden shadow-lg sm:h-24 sm:w-24'>
              <ProfileAvatar avatar={typeof data?.avatar === "string" ? JSON.parse(data.avatar) : (data?.avatar ?? null)} />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-white'><span className='text-gray-400 text-lg'>@</span>{user.username}</h1>
              <p className={`text-sm ${data?.isVerified ? 'text-emerald-300' : 'text-gray-400'}`}>Email {data?.isVerified ? 'Verified' : 'Not Verified'}</p>
              {!data?.isVerified && (
                <a href="/verify-email" className='text-sm text-red-300 underline'>Please Verify your email!</a>
              )}
            </div>
          </div>

          <div className='flex flex-col items-center'>
            <EditProfile />
          </div>
        </div>
      </div>
    );
}