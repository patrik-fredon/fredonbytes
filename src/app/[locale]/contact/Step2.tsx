import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Building } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/common/Button";

interface Step2Props {
	register: UseFormRegister<any>;
	errors: FieldErrors;
	t: (key: string) => string;
	nextStep: () => void;
	prevStep: () => void;
	projectTypes: string[];
	budgetRanges: string[];
	timelines: string[];
}

export function Step2({
	register,
	errors,
	t,
	nextStep,
	prevStep,
	projectTypes,
	budgetRanges,
	timelines,
}: Step2Props) {
	return (
		<motion.div
			key="step-2"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			transition={{ duration: 0.3 }}
			className="space-y-6"
		>
			<div className="flex items-center space-x-3 mb-6">
				<Building className="w-6 h-6 text-neon-cyan" />
				<h3 className="text-xl font-mono font-bold text-terminal-light">
          // {t("contact.projectDetails")}
				</h3>
			</div>
			<div>
				<label className="block text-sm font-mono font-medium text-terminal-light/90 mb-2">
					{t("contact.company")}
				</label>
				<input
					{...register("company")}
					className="w-full px-4 py-3 glass-bg backdrop-blur-glass border-2 border-neon-cyan/30 rounded-lg focus:border-neon-cyan focus:shadow-glow-cyan-subtle transition-all duration-200 text-terminal-light placeholder:text-terminal-light/50"
					placeholder={t("contact.companyPlaceholder")}
				/>
			</div>
			<div>
				<label className="block text-sm font-mono font-medium text-terminal-light/90 mb-2">
					{t("contact.projectType")} *
				</label>
				<select
					{...register("projectType")}
					className="w-full px-4 py-3 glass-bg backdrop-blur-glass border-2 border-neon-cyan/30 rounded-lg focus:border-neon-cyan focus:shadow-glow-cyan-subtle transition-all duration-200 text-terminal-light"
				>
					<option value="">{t("contact.selectProjectType")}</option>
					{projectTypes.map((type) => (
						<option key={type} value={type}>
							{type}
						</option>
					))}
				</select>
				<AnimatePresence>
					{errors.projectType && (
						<motion.p
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="mt-1 text-sm text-red-600"
						>
							{errors.projectType.message as string}
						</motion.p>
					)}
				</AnimatePresence>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-mono font-medium text-terminal-light/90 mb-2">
						{t("contact.budget")} *
					</label>
					<select
						{...register("budget")}
						className="w-full px-4 py-3 glass-bg backdrop-blur-glass border-2 border-neon-cyan/30 rounded-lg focus:border-neon-cyan focus:shadow-glow-cyan-subtle transition-all duration-200 text-terminal-light"
					>
						<option value="">{t("contact.selectBudget")}</option>
						{budgetRanges.map((range) => (
							<option key={range} value={range}>
								{range}
							</option>
						))}
					</select>
					<AnimatePresence>
						{errors.budget && (
							<motion.p
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className="mt-1 text-sm text-red-600"
							>
								{errors.budget.message as string}
							</motion.p>
						)}
					</AnimatePresence>
				</div>

				<div>
					<label className="block text-sm font-mono font-medium text-terminal-light/90 mb-2">
						{t("contact.timeline")} *
					</label>
					<select
						{...register("timeline")}
						className="w-full px-4 py-3 glass-bg backdrop-blur-glass border-2 border-neon-cyan/30 rounded-lg focus:border-neon-cyan focus:shadow-glow-cyan-subtle transition-all duration-200 text-terminal-light"
					>
						<option value="">{t("contact.selectTimeline")}</option>
						{timelines.map((timeline) => (
							<option key={timeline} value={timeline}>
								{timeline}
							</option>
						))}
					</select>
					<AnimatePresence>
						{errors.timeline && (
							<motion.p
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className="mt-1 text-sm text-red-600"
							>
								{errors.timeline.message as string}
							</motion.p>
						)}
					</AnimatePresence>
				</div>
			</div>

			<div className="flex space-x-4">
				<Button
					type="button"
					variant="outline"
					size="lg"
					className="flex-1"
					onClick={prevStep}
					leftIcon={<ArrowLeft className="w-4 h-4" />}
				>
					{t("contact.back")}
				</Button>
				<Button
					type="button"
					variant="gradient"
					size="lg"
					className="flex-1"
					onClick={nextStep}
					rightIcon={<ArrowRight className="w-4 h-4" />}
				>
					{t("contact.continue")}
				</Button>
			</div>
		</motion.div>
	);
}
