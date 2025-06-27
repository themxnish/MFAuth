type ProfilePageProps = {
  params: { username: string };
};

export default function ProfilePage({ params }: ProfilePageProps) {
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Username: {params.username}</p>
    </div>
  );
}