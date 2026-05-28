import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CrossIcon } from "lucide-react"
import { format } from "date-fns";
import { LogoutButton } from "@/app/components/logout";
import { EditProfileButton } from "@/app/components/editProfileButton";
import { db } from "@/lib/db";
import ProfileAvatar from "@/app/components/avatar/profileAvatar";
import { ProfileSubmissions } from "@/app/components/profileSubmissions";

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
      email: true,
      createdAt: true,
      updatedAt: true,
      avatar: true,
      evidenceSubmissions: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          incidentType: true,
          location: true,
          datetime: true,
          description: true,
          createdAt: true,
        },
      },
    },
  });
  
  if (!user) {
    redirect("/login");
  } else if (user.username !== data?.username) {
    return(
      <div className='text-center items-center justify-center flex flex-col h-[80vh] px-4'>
        <div className='rounded-3xl border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/30 p-6 max-w-md w-full'>
          <CrossIcon className='w-12 h-12 text-red-400 mx-auto rotate-45 mb-4' />
          <h1 className='text-2xl font-bold mb-2 text-white'>Unauthorized Access</h1>
          <p className='text-sm text-gray-400'>You do not have permission to view this profile.</p>
        </div>
      </div>
    )
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
            <p className='text-sm text-gray-400'>Profile Overview</p>
          </div>
        </div>

        <div className='mt-6 space-y-4'>
          <div className='p-4 rounded-2xl border border-white/10 shadow-xl bg-white/[0.06]'>
            <div className='flex items-center justify-between text-sm'>
              <p className='text-gray-300'>Email:</p>
              <p className='font-semibold text-white truncate'>{user.email}</p>
            </div>
            <div className='flex items-center justify-between text-sm mt-2'>
              <p className='text-gray-300'>Fullname:</p>
              <p className="font-semibold text-white">{user.name}</p>
            </div>
            <div className='flex items-center justify-between text-sm mt-2'>
              <p className='text-gray-300'>Bio:</p>
              <div className='w-1/2 justify-end text-right'>
                <p className="font-semibold text-white">{user.bio}</p>
              </div>
            </div>
            <div className='flex items-center justify-between text-sm mt-2'>
              <p className='text-gray-300'>Joined:</p>
              <p className="font-semibold text-white">
                {user.createdAt ? format(user.createdAt, 'MMMM dd, yyyy') : "N/A"}
              </p>
            </div>
            <div className='flex items-center justify-between text-sm mt-2'>
              <p className='text-gray-300'>Last Updated:</p>
              <p className="font-semibold text-white">
                {user.updatedAt ? format(user.updatedAt, 'MMMM dd, yyyy') : "N/A"}
              </p>
            </div>
          </div>

          <div className='flex flex-row justify-between items-center p-4 rounded-2xl border border-white/10 shadow-xl bg-white/[0.06]'>
            <h2 className='text-md font-semibold text-white mb-2'>2FA Authentication Status</h2>
            {user.isVerified ? <p className='text-green-400'>Enabled</p> : <p className='text-red-400'>Disabled</p>}
          </div>

          <ProfileSubmissions submissions={data?.evidenceSubmissions ?? []} />

          <div className=' flex flex-row gap-4 text-center justify-between items-center'>
            <EditProfileButton username={user.username} />
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
