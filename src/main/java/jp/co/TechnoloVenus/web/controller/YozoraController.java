package jp.co.TechnoloVenus.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * yozoraページのURLを定義するクラス
 */
@Controller
public class YozoraController {
	/**
	 * yozoraページのhtmlファイル名を返すメソッド
	 * @return htmlファイル名
	 */
	@GetMapping("/yozora")
	public String goYozora() {
		return "yozora";
	}
}
