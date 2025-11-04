import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, MessageSquare } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/common/Button";
import { Link } from "@/i18n/navigation";

interface Step3Props {
	register: UseFormRegister<any>;
	errors: FieldErrors;
	t: (key: string) => string;
	prevStep: () => void;
	isSubmitting: boolean;
	isValid: boolean;
	requirements: string[];
}

export function Step3({
	register,
	errors,
	t,
	prevStep,
	isSubmitting,
	isValid,
	requirements,
}: Step3Props) {
	return (
		<motion.div
			key="step-3"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			transition={{ duration: 0.3 }}
			className="space-y-6"
		>
			<div className="flex items-center space-x-3 mb-6">
				<MessageSquare className="w-6 h-6 text-neon-cyan" />
				<h3 className="text-xl font-mono font-bold text-terminal-light">
          // {t("contact.projectRequirements")}
				</h3>
			</div>
			<div>
				<label className="block text-sm font-mono font-medium text-terminal-light/90 mb-2">
					{t("contact.projectDescription")} *
				</label>
				<textarea
					{...register("message")}
					rows={4}
					className="w-full px-4 py-3 glass-bg backdrop-blur-glass border-2 border-neon-cyan/30 rounded-lg focus:border-neon-cyan focus:shadow-glow-cyan-subtle transition-all duration-200 text-terminal-light placeholder:text-terminal-light/50"
					placeholder={t("contact.projectDescriptionPlaceholder")}
				/>
				<AnimatePresence>
					{errors.message && (
						<motion.p
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="mt-1 text-sm text-red-600"
						>
							{errors.message.message as string}
						</motion.p>
					)}
				</AnimatePresence>
			</div>
			<div>
				<label className="block text-sm font-mono font-medium text-terminal-light/90 mb-3">
					{t("contact.additionalRequirements")}
				</label>
				<div className="grid grid-cols-2 gap-3">
					{requirements.map((req) => (
						<label
							key={req}
							className="flex items-center space-x-2 cursor-pointer group"
						>
							<input
								type="checkbox"
								value={req}
								{...register("requirements")}
								className="w-5 h-5 rounded border-2 border-neon-cyan/50 bg-terminal-dark/80 text-neon-cyan focus:ring-2 focus:ring-neon-cyan/50 focus:ring-offset-0 cursor-pointer checked:bg-neon-cyan checked:border-neon-cyan hover:border-neon-cyan transition-colors"
							/>
							<span className="text-sm text-terminal-light/80 group-hover:text-terminal-light transition-colors">
								{req}
							</span>
						</label>
					))}
				</div>
			</div>

			<div className="space-y-4">
				<label className="flex items-center space-x-2 cursor-pointer group">
					<input
						type="checkbox"
						{...register("newsletter")}
						className="w-5 h-5 rounded border-2 border-neon-cyan/50 bg-terminal-dark/80 text-neon-cyan focus:ring-2 focus:ring-neon-cyan/50 focus:ring-offset-0 cursor-pointer checked:bg-neon-cyan checked:border-neon-cyan hover:border-neon-cyan transition-colors"
					/>
					<span className="text-sm text-terminal-light/80 group-hover:text-terminal-light transition-colors">
						{t("contact.subscribeNewsletter")}
					</span>
				</label>

				<label className="flex items-start space-x-2 cursor-pointer group">
					<input
						type="checkbox"
						{...register("privacy")}
						className="w-5 h-5 rounded border-2 border-neon-cyan/50 bg-terminal-dark/80 text-neon-cyan focus:ring-2 focus:ring-neon-cyan/50 focus:ring-offset-0 cursor-pointer checked:bg-neon-cyan checked:border-neon-cyan hover:border-neon-cyan transition-colors mt-0.5"
					/>
					<span className="text-sm text-terminal-light/80 group-hover:text-terminal-light transition-colors">
						{t("contact.agreeToPrivacy")}{" "}
						<Link
							href="/privacy"
							className="text-neon-cyan hover:text-neon-purple transition-colors underline"
							onClick={(e) => e.stopPropagation()}
						>
							{t("contact.privacyPolicy")}
						</Link>{" "}
						*
					</span>
				</label>
				<AnimatePresence>
					{errors.privacy && (
						<motion.p
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="text-sm text-red-600"
						>
							{errors.privacy.message as string}
						</motion.p>
					)}
				</AnimatePresence>
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
					type="submit"
					variant="gradient"
					size="lg"
					className="flex-1"
					loading={isSubmitting}
					disabled={!isValid}
				>
					{t("contact.sendMessage")}
				</Button>
			</div>
		</motion.div>
	);
}
