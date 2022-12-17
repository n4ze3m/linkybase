import { createStyles, Text, SimpleGrid, Container } from '@mantine/core';
import { IconTruck, IconCertificate, IconCoin, TablerIcon, IconBrandOpenSource, IconShare, IconSearch } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  feature: {
    position: 'relative',
    paddingTop: theme.spacing.xl,
    paddingLeft: theme.spacing.xl,
  },

  overlay: {
    position: 'absolute',
    height: 100,
    width: 160,
    top: 0,
    left: 0,
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    zIndex: 1,
  },

  content: {
    position: 'relative',
    zIndex: 2,
  },

  icon: {
    color: theme.colors.teal
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
  },
}));

interface FeatureProps extends React.ComponentPropsWithoutRef<'div'> {
  icon: TablerIcon;
  title: string;
}

function FeatureComponent({ icon: Icon, title, className, ...others }: FeatureProps) {
  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.feature, className)} {...others}>
      <div className={classes.overlay} />

      <div className={classes.content}>
        <Icon size={38} className={classes.icon} stroke={1.5} />
        <Text weight={700} size="lg" mb="xs" mt={5} className={classes.title}>
          {title}
        </Text>
      </div>
    </div>
  );
}

const featureData = [
  {
    icon: IconShare,
    title: 'Share collection',
  },
  {
    icon: IconSearch,
    title: 'Mini search engine',
  },
  {
    icon: IconBrandOpenSource,
    title: 'Free and Open Source',
  },
];

export function Feature() {
  const items = featureData.map((item) => <FeatureComponent {...item} key={item.title} />);

  return (
    <Container mt={30} mb={30} size="lg">
      <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} spacing={50}>
        {items}
      </SimpleGrid>
    </Container>
  );
}