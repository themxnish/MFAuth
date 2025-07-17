import Cipher from "./components/cipher";
import Verify from "./components/verify";
import WelcomeText from "./components/welcome";

export default function Home() {
  return(
    <div className='p-4 flex flex-col items-center'>
      <div className='w-full'>
        <WelcomeText />
        <div className='mb-4 flex justify-center w-full'>
          <div className='w-full sm:w-1/2 max-w-md'>
            <Verify />
          </div>
        </div>
        <Cipher />
      </div>
    </div>
  );
}
