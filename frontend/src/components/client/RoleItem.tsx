import { StyleSheet, ScrollView} from 'react-native'
import { ModText } from '../StyledText';
import { memo } from 'react';

type RoleProps = {
    role: string;
    size: string
}
const RoleItem = memo(({role, size}: RoleProps)  => (
  <ScrollView style={size === 'S' ? [styles.roleTagContainerDef, styles.smRoleTagContainer] : [styles.roleTagContainerDef, styles.mdRoleTagContainer]} key={role} horizontal>
      <ModText style={size === 'S' ? [styles.roleTextDef, styles.smRoleText] : [styles.roleTextDef, styles.mdRoleText]}> {role} </ModText>
  </ScrollView>
  ), 
  (prevProps, nextProps) => {
    return prevProps.role === nextProps.role;
  },
);
// export default function RoleItem({role} : RoleProps) {
//   return (
//     <ScrollView style={styles.roleTagContainer} key={role} horizontal={true}>
//       <ModText style={styles.roleText}> {role} </ModText>
//     </ScrollView>
//   )
// }
export default RoleItem;

const styles = StyleSheet.create({
  roleTagContainerDef: {
    backgroundColor: "#3628D4",
    borderRadius: 5,
    padding: 5,
    marginRight: 5
  },
  roleTextDef:{
    color: "#FAF9F6",
    position: "relative",
  },
  smRoleTagContainer: {
    height: 30,
  },
  smRoleText:{
    fontSize: 12,
    top: 2
  },
  mdRoleTagContainer:{
    height: 40
  },
  mdRoleText:{
    fontSize: 16,
    top: 6
  },
})