import { db } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditProfile from "@/app/components/editProfile";
import ProfileAvatar from "@/app/components/avatar/profileAvatar";

type EditProfilePageProps = {
  params: { username: string };
};

export default async function ProfilePage(props: EditProfilePageProps) {
    const params = await props.params;
    const user = await getUserFromToken();
  
    const data = await db.user.findUnique({
      where: { username: params.username },
      select: {
        id: true,
        username: true,
        avatar: true,
        isVerified: true
      },
    });
    
    if (!data || data.username !== params.username || !user) {
      redirect("/login");
    }

    return (
      <div className='min-h-screen flex items-center justify-center px-4'>
        <div className='w-full max-w-xl bg-[#3B3B3B] shadow-xl rounded-xl p-6'>
          <div className='flex items-center gap-4 '>
            <div className='h-24 w-24 rounded-full border-5 border-black overflow-hidden shadow-lg'>
              <ProfileAvatar avatar={typeof data?.avatar === "string" ? JSON.parse(data.avatar) : (data?.avatar ?? null)} />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-white'><span className='text-gray-400 text-lg'>@</span>{user.username}</h1>
              <p className='text-sm text-gray-400'>Email {data?.isVerified ? 'Verified' : 'Not Verified'}</p>
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