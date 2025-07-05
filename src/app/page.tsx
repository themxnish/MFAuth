import Verify from "./components/verify";

export default function Home() {
  return(
    <div className='p-4 flex flex-col items-center'>
      <div className='w-full sm:w-1/3'>
        <Verify />
      </div>
    </div>
  );
}
