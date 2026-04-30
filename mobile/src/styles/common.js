import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export const commonStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  heading: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  subHeading: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  fieldLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: COLORS.textLight },
  input: { 
    borderColor: COLORS.border, 
    borderWidth: 1, 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderRadius: 8, 
    backgroundColor: COLORS.surface, 
    marginBottom: 16, 
    fontSize: 16 
  },
  pickerContainer: { 
    borderColor: COLORS.border, 
    borderWidth: 1, 
    borderRadius: 8, 
    backgroundColor: COLORS.surface, 
    marginBottom: 16, 
    overflow: 'hidden' 
  },
  primaryButton: { 
    backgroundColor: COLORS.primary, 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  secondaryButton: { 
    backgroundColor: COLORS.surface, 
    padding: 14, 
    borderRadius: 8, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: COLORS.primary 
  },
  buttonText: { color: COLORS.surface, fontWeight: 'bold', fontSize: 16 },
  secondaryButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
  errorText: { color: COLORS.danger, marginBottom: 16, textAlign: 'center', fontWeight: '500' },
  detailBox: { 
    padding: 16, 
    backgroundColor: COLORS.surface, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#eee', 
    marginBottom: 20 
  },
  detailRow: { flexDirection: 'row', marginBottom: 6 },
  detailLabel: { width: 100, color: COLORS.textLight, fontWeight: '600' },
  resolutionBox: { 
    padding: 16, 
    backgroundColor: '#e6fffa', 
    borderRadius: 12, 
    borderLeftWidth: 4, 
    borderLeftColor: '#38b2ac' 
  },
  adminActionSection: { 
    borderTopWidth: 1, 
    borderTopColor: '#eee', 
    paddingTop: 24, 
    marginTop: 10 
  },
});
