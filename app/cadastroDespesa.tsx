import { Button } from "@/src/components/button";
import { Feedback } from "@/src/components/feedback";
import { Input } from "@/src/components/input";
import { createExpense, deleteExpense, updateExpense } from "@/src/service/api";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
	Alert,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

interface CadastroDespesaProps {
	onClose: () => void;
	despesa?: any;
	onSaved?: () => void;
}
export const CadastroDespesa = ({
	onClose,
	despesa,
	onSaved,
}: CadastroDespesaProps) => {
	const [descricao, setDescricao] = useState("");
	const [valor, setValor] = useState("");
	const [categoria, setCategoria] = useState("alimentacao");
	const [tipo, setTipo] = useState("despesa");
	const [date, setDate] = useState<Date | null>(null);
	const [show, setShow] = useState(false);
	const [recorrente, setRecorrente] = useState(false);
	const [saving, setSaving] = useState(false);

	const isEditing = !!despesa;

	const [feedback, setFeedback] = useState<{
		type: "success" | "error" | "info";
		message: string;
	} | null>(null);

	function isValidDate(d: any): d is Date {
		return d instanceof Date && !isNaN(d.getTime());
	}

	useEffect(() => {
		if (despesa) {
			setDescricao(despesa.titulo ?? "");
			setValor(
				despesa.valor !== undefined && despesa.valor !== null
					? String(despesa.valor)
					: "",
			);

			if (despesa.data) {
				const parsed = new Date(despesa.data);
				setDate(!isNaN(parsed.getTime()) ? parsed : null);
			} else {
				setDate(null);
			}

			setCategoria(despesa.categoria ?? "alimentacao");
		} else {
			setDescricao("");
			setValor("");
			setCategoria("alimentacao");
			setDate(null);
		}
	}, [despesa]);

	function onChange(_: any, selectedDate?: Date) {
		setShow(Platform.OS === "ios");
		if (selectedDate) setDate(selectedDate);
	}

	async function handleSalvar() {
		if (!descricao || !valor || !date) {
			setFeedback({
				type: "error",
				message: "Preencha todos os campos.",
			});
			return;
		}

		if (!isValidDate(date)) {
			setFeedback({
				type: "error",
				message: "Selecione uma data válida.",
			});
			return;
		}

		setSaving(true);
		setFeedback(null);

		const payload = {
			titulo: descricao,
			valor: Number(valor),
			categoria,
			data: date.toISOString().slice(0, 10),
		};

		const response = despesa
			? await updateExpense(despesa.id, payload)
			: await createExpense(payload);

		setSaving(false);

		if (response.success) {
			setFeedback({
				type: "success",
				message: despesa
					? "Despesa atualizada com sucesso!"
					: "Despesa cadastrada com sucesso!",
			});

			onSaved?.();

			setTimeout(() => {
				onClose();
			}, 1200);
		} else {
			setFeedback({
				type: "error",
				message: response.message || "Erro ao salvar despesa.",
			});
		}
	}
	return (
		<View style={styles.modalCard}>
			<View style={styles.header}>
				{isEditing ? (
					<Text style={styles.title}>Nova Despesa</Text>
				) : (
					<Text style={styles.title}>Editar despesa</Text>
				)}
				<TouchableOpacity onPress={onClose} style={styles.closeIconContainer}>
					<Text style={styles.closeIcon}>✕</Text>
				</TouchableOpacity>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Descrição</Text>
					<Input
						style={styles.input}
						placeholder="Ex: Aluguel, Supermercado..."
						value={descricao}
						onChangeText={setDescricao}
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Valor</Text>
					<Input
						style={styles.input}
						placeholder="R$ 0,00"
						value={valor}
						onChangeText={setValor}
						keyboardType="numeric"
					/>
				</View>

				<View style={styles.row}>
					<View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
						<Text style={styles.label}>Data</Text>
						<TouchableOpacity
							onPress={() => setShow(true)}
							style={styles.selectorButton}
						>
							<Text style={styles.selectorText}>
								{date ? date.toLocaleDateString("pt-BR") : "Selecionar"}
							</Text>
						</TouchableOpacity>
					</View>

					<View style={[styles.inputGroup, { flex: 1 }]}>
						<Text style={styles.label}>Tipo</Text>
						<View style={styles.pickerWrapper}>
							<Picker
								selectedValue={tipo}
								onValueChange={setTipo}
								style={styles.picker}
								dropdownIconColor="#4B5563"
							>
								<Picker.Item
									label="Despesa"
									value="despesa"
									style={styles.pickerItem}
								/>
								<Picker.Item
									label="Meta"
									value="meta"
									style={styles.pickerItem}
								/>
							</Picker>
						</View>
					</View>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Categoria</Text>
					<View style={styles.pickerWrapper}>
						<Picker
							selectedValue={categoria}
							onValueChange={setCategoria}
							style={styles.picker}
						>
							<Picker.Item
								label="Alimentação"
								value="alimentacao"
								style={styles.pickerItem}
							/>
							<Picker.Item
								label="Habitação"
								value="habitacao"
								style={styles.pickerItem}
							/>
							<Picker.Item
								label="Transporte"
								value="transporte"
								style={styles.pickerItem}
							/>
							<Picker.Item
								label="Saúde"
								value="saude"
								style={styles.pickerItem}
							/>
							<Picker.Item
								label="Lazer"
								value="lazer"
								style={styles.pickerItem}
							/>
						</Picker>
					</View>
				</View>

				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => setRecorrente(!recorrente)}
					style={styles.checkboxRow}
				>
					<View style={[styles.checkbox, recorrente && styles.checkboxChecked]}>
						{recorrente && <Text style={styles.checkMark}>✓</Text>}
					</View>
					<Text style={styles.checkboxLabel}>
						Esta despesa se repete todo mês
					</Text>
				</TouchableOpacity>

				{show && (
					<DateTimePicker
						value={date || new Date()}
						mode="date"
						display={Platform.OS === "ios" ? "inline" : "default"}
						onChange={onChange}
					/>
				)}
			</ScrollView>

			<View style={styles.footer}>
				{feedback && (
					<Feedback type={feedback.type} message={feedback.message} />
				)}
				<Button
					label={saving ? "Salvando..." : "Salvar"}
					onPress={handleSalvar}
					disabled={saving}
				/>
				{isEditing && (
					<Button
						label="Excluir Despesa"
						id="danger"
						onPress={() => {
							Alert.alert(
								"Confirmar exclusão",
								"Deseja realmente excluir esta despesa?",
								[
									{
										text: "Cancelar",
										style: "cancel",
									},
									{
										text: "Excluir",
										style: "destructive",
										onPress: async () => {
											if (!despesa) return;

											const result = await deleteExpense(despesa.id);

											if (result.success) {
												setFeedback({
													type: "success",
													message: "Despesa removida com sucesso.",
												});
												onSaved?.();

												setTimeout(() => {
													onClose();
												}, 1200);
											} else {
												setFeedback({
													type: "error",
													message: "Não foi possível ecluir a despesa",
												});
											}
										},
									},
								],
							);
						}}
					/>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	modalCard: {
		width: "95%",
		maxWidth: 400,
		maxHeight: "85%",
		backgroundColor: "#FFFFFF",
		borderRadius: 24,
		overflow: "hidden",
		elevation: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.1,
		shadowRadius: 20,
	},
	header: {
		padding: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: "#F3F4F6",
	},
	title: {
		fontSize: 18,
		fontWeight: "700",
		color: "#111827",
	},
	closeIconContainer: {
		padding: 4,
		backgroundColor: "#F3F4F6",
		borderRadius: 20,
	},
	closeIcon: {
		fontSize: 16,
		color: "#6B7280",
		fontWeight: "bold",
		width: 20,
		textAlign: "center",
	},
	scrollContent: {
		padding: 20,
		gap: 16,
	},
	inputGroup: {
		marginBottom: 4,
	},
	label: {
		fontSize: 13,
		fontWeight: "600",
		color: "#4B5563",
		marginBottom: 6,
		marginLeft: 4,
	},
	input: {
		backgroundColor: "#F9FAFB",
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 12,
		paddingHorizontal: 16,
		height: 50,
		fontSize: 14,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	selectorButton: {
		backgroundColor: "#F9FAFB",
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 12,
		height: 48,
		justifyContent: "center",
		paddingHorizontal: 16,
	},
	selectorText: {
		fontSize: 14,
		color: "#1F2937",
	},
	pickerWrapper: {
		backgroundColor: "#F9FAFB",
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 12,
		justifyContent: "center",
		overflow: "hidden",
	},
	picker: {
		height: 48,
		width: "100%",
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	checkboxRow: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 8,
		paddingVertical: 4,
	},
	checkbox: {
		width: 22,
		height: 22,
		borderWidth: 2,
		borderColor: "#D1D5DB",
		borderRadius: 6,
		marginRight: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	checkboxChecked: {
		backgroundColor: "#37a346",
		borderColor: "#37a346",
	},
	checkMark: {
		color: "#FFF",
		fontSize: 12,
		fontWeight: "bold",
	},
	checkboxLabel: {
		fontSize: 14,
		color: "#4B5563",
	},
	footer: {
		paddingBottom: 20,
		borderTopWidth: 1,
		borderTopColor: "#F3F4F6",
		alignItems: "center",
	},
	pickerItem: {
		fontSize: 14,
		color: "#1F2937",
	},
});

export default CadastroDespesa;
