import { Blocks, type BuilderBlock } from '@builder.io/sdk-react'

export const UiBlocks = (props: { childBlocks1?: BuilderBlock[], childBlocks2?: BuilderBlock[], builderBlock: BuilderBlock, children?: React.ReactNode }) => {
  const { childBlocks1, childBlocks2, builderBlock } = props;
  console.log('props', props);

  return (
    <section className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Blocks blocks={childBlocks1}
          path="childBlocks1"
          parent={builderBlock.id} />
        <Blocks blocks={childBlocks2}
          path="childBlocks2"
          parent={builderBlock.id} />
      </div>
    </section>);
};