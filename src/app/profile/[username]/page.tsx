import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CrossIcon } from "lucide-react"
import { format } from "date-fns";
import { LogoutButton } from "@/app/components/logout";
import { EditProfileButton } from "@/app/components/editProfileButton";
import { db } from "@/lib/db";
import ProfileAvatar from "@/app/components/avatar/profileAvatar";
import AvatarSelector from "@/app/components/avatar/avatar";
import Verify from "@/app/components/verify";

type ProfilePageProps = {
  params: { username: string };
};


export default async function ProfilePage(props: ProfilePageProps) {
  const params = await props.params;
  const user = await getUserFromToken();

  const data = await db.user.findUnique({
    where: { username: params.username },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      avatar: true,
    },
  });
  
  if (!user) {
    redirect("/login");
  } else if (user.username !== params.username) {
    return(
      <div className='text-center items-center justify-center flex flex-col h-[80vh] px-4'>
        <div className='bg-[#3B3B3C] shadow-xl rounded-xl p-6 max-w-md w-full'>
          <CrossIcon className='w-12 h-12 text-red-400 mx-auto rotate-45 mb-4' />
          <h1 className='text-2xl font-bold mb-2 text-white'>Unauthorized Access</h1>
          <p className='text-sm text-gray-400'>You do not have permission to view this profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-xl bg-[#3B3B3B] shadow-xl rounded-xl p-6'>
        <div className='flex items-center gap-4'>
          <div className='h-24 w-24 rounded-full border-5 border-black overflow-hidden shadow-lg'>
            <ProfileAvatar avatar={typeof data?.avatar === "string" ? JSON.parse(data.avatar) : (data?.avatar ?? null)} />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-white'><span className='text-gray-400 text-lg'>@</span>{user.username}</h1>
            <p className='text-sm text-gray-400'>Profile Overview</p>
          </div>
        </div>

        <Verify />

        <div className='mt-6 space-y-4'>
          <div className='p-4 rounded-lg shadow-xl bg-[#4B4B4B]'>
            <div className='flex items-center justify-between text-sm'>
              <p className='text-gray-300'>Email:</p>
              <p className='font-semibold text-white truncate'>{user.email}</p>
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

          <div className='p-4 rounded-lg shadow-xl bg-[#4B4B4B]'>
            <h2 className='text-md font-semibold text-white mb-2'>2FA Authentication Status</h2>
          </div>

          <AvatarSelector />

          <div className=' flex flex-row gap-4 text-center justify-between items-center'>
            <EditProfileButton username={user.username} />
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}