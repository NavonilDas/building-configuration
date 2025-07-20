import { BuildingConfigurator } from "@/components/BuildingConfigurator";
import { GetStaticProps } from "next";

export default function Home() {
  return (
    <div className="h-full">
      <BuildingConfigurator />
    </div>
  );
}

export const getStaticProps = (async () => {
  return { props: { } }
})satisfies GetStaticProps<object>;