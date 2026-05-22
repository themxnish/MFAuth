import Cipher from "./components/cipher";
import HomeFeatures from "./components/homeFeatures";
import WelcomeText from "./components/welcome";

export default function Home() {
  return(
    <div className='px-4 pb-10 flex flex-col items-center'>
      <div className='w-full max-w-6xl'>
        <WelcomeText />
        <HomeFeatures />
        <section id='cipher'>
          <Cipher />
        </section>
      </div>
    </div>
  );
}
