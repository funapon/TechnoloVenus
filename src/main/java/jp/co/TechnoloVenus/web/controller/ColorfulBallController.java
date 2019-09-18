package jp.co.TechnoloVenus.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * colorful_ballページのURLを定義するクラス
 */
@Controller
public class ColorfulBallController {
	/**
	 * colorful_ballページのhtmlファイル名を返すメソッド
	 * @return htmlファイル名
	 */
	@GetMapping("/colorful_ball")
	public String goColorful_ball() {
		return "colorful_ball";
	}
}
